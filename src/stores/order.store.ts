import {
    ApiClient,
    BaseAction,
    BaseState,
    CartMetaData,
    Coupon,
    defaultAsyncState,
    OrderCreateRequest,
    OrderDetailList,
    OrderResponseSchema,
    ProductDescriptionSchema,
    ProductItemSchema,
    ProductMetadataSchema,
    QueryParams,
    setLoadAndDo
} from "@/api";
import {create} from "zustand/index";
//import {Calculations} from "@/lib/utils";
import {z} from "zod";


namespace OrderSingle {
    type State = BaseState & {
        previewOrderDetails: OrderDetailList,
        gross: number,
        applied: number,
        net: number,
        coupon: Coupon | null
    }

    type Action = BaseAction & {
        initialize: (cartLocal: CartMetaData.Local) => Promise<void>,
        createOrder: (request: OrderCreateRequest)=>Promise<void>,
    }
    type Store = State & Action;

    const initState: State = {
        ...defaultAsyncState,
        previewOrderDetails: [],
        gross: 0,
        applied: 0,
        net: 0,
        coupon: null,
    }

    export const useStore = create<Store>((set, get) => ({
        ...initState,
        async initialize(cartLocal) {
            const ids: number[] = cartLocal.keys().toArray();
            const responses = await OrderApis.getProductByIdIn(ids);
            const domains: CartMetaData.CartDomainList = responses.map(p => ({
                price: p.price ?? 0,
                quantity: p.quantity ?? 0,
                productId: p.id ?? 0,
                originalPrice: p.originalPrice ?? 0,
                product: {
                    id: p.id,
                    price: p.price ?? 0,
                    name: p.name ?? '',
                    originalPrice: p.originalPrice ?? 0,
                    slug: p.slug ?? '',
                    imageUrl: p.imageUrl ?? null
                }
            }))

            //set({previewOrderDetails: domains, ...Calculations.calculateAmounts(get().previewOrderDetails, get().coupon)})
        },
        proxyLoading(run, lastAction = null) {
            setLoadAndDo(set, run, lastAction);
        },
        async createOrder(request: OrderCreateRequest){
            const response = await OrderApis.create(request);
        },
        async getBydId(id: number){
            const response = await OrderApis.getById(id);
        }
    }));

}
namespace OrderApis{
    const client = ApiClient.getInstance();

    /// TODO: REFACTOR THIS
    const ProductResponseSchema = z.object({
        id: z.number(),
        productDescription: ProductDescriptionSchema.nullish(),
        slug: z.string().nullish(),
        name: z.string().nullish(),
        imageUrl: z.string().nullish(),
        tags: z.array(z.string()).nullish(),
        favorite: z.boolean().nullish(),
        groupId: z.number().nullish(),
        price: z.number().nullish(),
        originalPrice: z.number().nullish(),
        quantity: z.number(),
        status: z.string(),
        variants: ProductMetadataSchema,
        productItems: z.array(ProductItemSchema).nullish()
    })
    const ProductResponseSchemaList = z.array(ProductResponseSchema)
    type ProductResponseType = z.infer<typeof ProductResponseSchema>

    export const getProductByIdIn = async (ids: number[]): Promise<ProductResponseType[]> => {
        const requestPagination: QueryParams = {
            pageRequest: {
                page: 0,
                size: ids.length,
                sortBy: "id",
                sortDirection: "asc"
            },
            ids: ids
        }
        const responses = await client.post(
            "/products/searches",
            ProductResponseSchemaList,
            requestPagination,
        );
        return responses;
    }

    export const create = (request: OrderCreateRequest)=>{
        return client.post("/orders", OrderResponseSchema, request)
    }
    export const getById = (id: number)=>{
        return client.get(`/orders/${id}`, OrderResponseSchema,)
    }
}


