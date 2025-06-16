import {
    ApiClient,
    BaseAction,
    BaseState,
    CartMetaData,
    Coupon,
    CouponSchema,
    defaultAsyncState,
    DisposeAction,
    Order,
    OrderCreateRequest,
    OrderDetail,
    OrderDetailResponse,
    OrderPageSchema,
    OrderResponse,
    OrderResponseSchema,
    Pageable,
    PaymentDomain,
    ProductResponsePage,
    ProductResponseType,
    QueryParams,
    setLoadAndDo,
    UserProfileDetailed
} from "@/api";
import {create} from "zustand/index";
import {undefined, z} from "zod";
import {ApiError} from "@/api/client/base_client";


export namespace OrderCustomer {
    const MailSchema = z
        .string().email().transform((val) => (val === '' ? null : val))
        .nullable();
    type MailType = z.infer<typeof MailSchema>
    type State = BaseState & {
        cartItems: OrderDetail[],
        extraMail: MailType,
        orderStatus: null,
        gross: number,
        applied: number,
        net: number,
        payment: PaymentDomain,
        viewOnly: boolean,
        coupon: Coupon | null,
    }

    type Action = BaseAction & {
        initialize: (cartLocal: CartMetaData.Local) => Promise<void>,
        createOrder: () => Promise<number>,
        setQty(index: number, qty: number): void
        removeCartItem(index: number): void
        getBydId(id: number): Promise<void>
        applyCoupon(code: string): Promise<void>
        applyMail(string: string): string | undefined,
        bindResponse: (response: OrderResponse) => void,
        // getById: (id : number) => Promise<void>,
    }
    type Store = State & Action;

    const initState: State = {
        viewOnly: false,
        orderStatus: null,
        ...defaultAsyncState,
        payment: {
            id: 0,
            profileId: 0,
            status: null,
            paymentMethod: "",
            detailCode: "",
            detailMessage: "",
            note: "",
            cardType: ""
        },
        extraMail: null,
        cartItems: [],
        gross: 0,
        applied: 0,
        net: 0,
        coupon: null,
    }

    export const useStore = create<Store>((set, get) => ({
        ...initState,
        async initialize(cartLocal) {
            const ids: number[] = Object.keys(cartLocal).map(Number);
            if (ids.length <= 0)
                return;
            const responses = await OrderApis.getProductByIdIn(ids);
            const domains: OrderDetail[] = responses.map((p, i) => {
                const cartItem = cartLocal[p.id];

                return {
                    id: i,
                    price: p.price ?? 0,
                    quantity: cartItem?.qty ?? 0,
                    productId: p.id ?? 0,
                    originalPrice: p.originalPrice ?? 0,
                    product: {
                        id: p.id,
                        price: p.price ?? 0,
                        name: p.name ?? '',
                        quantity: p.quantity ?? 0,
                        originalPrice: p.originalPrice ?? 0,
                        slug: p.slug ?? '',
                        tags: p.tags ?? [],
                        imageUrl: p.imageUrl ?? "/empty_img.png"
                    }
                }
            })

            set({cartItems: domains, ...Calculations.calculateAmounts(domains, get().coupon)})
        },
        removeCartItem(index: number) {
            const rs = get().cartItems;
            rs.splice(index, 1);
            set({cartItems: rs})
        },
        setQty(index: number, qty: number) {
            if (index < 0 || index > get().cartItems.length)
                return;
            const newOds = [...get().cartItems]
            newOds[index].quantity = qty;
            set({cartItems: newOds})
        },
        applyMail(string: string): string | undefined {
            const parsedMail = MailSchema.safeParse(string);
            if (parsedMail.success)
                set({extraMail: parsedMail.data})

            return parsedMail.error?.message
        },
        async applyCoupon(code: string): Promise<void> {
            const codeResponse = await OrderApis.getCouponByCode(code);
            const {gross, applied, net} = Calculations.calculateAmounts(get().cartItems, codeResponse);
            set({coupon: codeResponse, gross, applied, net})
        },
        proxyLoading(run, lastAction = null) {
            setLoadAndDo(set, run, lastAction);
        },
        async createOrder() {
            const orderDetails = get().cartItems;
            const coupon = get().coupon;
            const requestInfo = get().extraMail ? {extraMail: get().extraMail} : {};
            const request: OrderCreateRequest = {
                requestInfo: requestInfo,
                orderDetails: orderDetails.map(od => ({
                    productId: od.product.id,
                    quantity: od.quantity
                })),
                couponCode: coupon?.code
            }
            const response = await OrderApis.create(request);
            get().bindResponse(response);
            return response.id ?? 0;
        },
        async getBydId(id: number): Promise<void> {
            const response = await OrderApis.getById(id);
            get().bindResponse(response);
            set({viewOnly: true})
        },
        bindResponse(response: OrderResponse) {
            if (!response)
                return;
            if (!response?.details)
                return;
            const details: OrderDetailResponse[] = response.details as OrderDetailResponse[] ?? [];
            const orderDetails: OrderDetail[] = Mappers.fromOderDetailResponseToDomain(details);
            const coupon = response?.coupon;
            set({cartItems: orderDetails, ...Calculations.calculateAmounts(orderDetails, coupon),})
        }
    }));

}

export namespace OrderMany {
    type State = BaseState & Pageable & {
        orders: Order[],
    }
    type Action = BaseAction & DisposeAction & {
        getOrders: (query: QueryParams) => Promise<void>;
        deleteOrders(ids: number[]): Promise<void>;
        deleteById(id: number): Promise<void>
    }
    type Store = State & Action;
    const initialValues: State = {
        orders: [],
        totalInstances: 0,
        totalPages: 0,
        currentPage: 0,
        ...defaultAsyncState,
        queryParams: {
            pageRequest: {
                page: 0,
                size: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
            },
        }
    }

    export const useStore = create<Store>((set, get) => {
        const x: Store = {
            ...initialValues,
            proxyLoading(run, lastAction = null) {
                setLoadAndDo(set, run, lastAction);
            },
            async deleteById(id: number) {
                if (id <= 0)
                    return;
                const count = await OrderApis.deleteById(id);
                if (count < 1) {
                    throw new ApiError(`${count} đơn hàng được xóa`)
                }
                const newOs = get().orders
                    .filter(o => o.id !== id);
                set({orders: newOs})
            },
            async getOrders(query: QueryParams): Promise<void> {
                const orderPage = await OrderApis.searchOrders(query)
                const domains: Order[] = orderPage.data.map(o => Mappers.fromOrderResponseToDomain(o))
                set({orders: domains, ...orderPage, queryParams: query})
            },
            async deleteOrders(ids: number[]): Promise<void> {
                if (ids?.length === 0)
                    return;

                const count = await OrderApis.deleteOrders(ids);
                if (count != ids.length) {
                    throw new ApiError(`${count} đơn hàng được xóa`)
                }
                const newOs = get().orders
                    .filter(o => ids.some(id => id === o.id));
                set({orders: newOs})
            },
            clean(): void {
                set({...initialValues})
            },
        }
        return x;
    })
}

namespace OrderApis {
    const client = ApiClient.getInstance();

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
            ProductResponsePage,
            requestPagination,
        );
        return responses.data;
    }

    export const create = async (request: OrderCreateRequest): Promise<OrderResponse> => {
        return client.post("/orders", OrderResponseSchema, request)
    }
    export const getById = (id: number): Promise<OrderResponse> => {
        return client.get(`/orders/${id}`, OrderResponseSchema,)
    }
    export const getCouponByCode = (code: string): Promise<Coupon> => {
        return client.get(`/coupons`, CouponSchema, {params: {code: code}})
    }

    export function searchOrders(query: QueryParams) {
        return client.post("/orders/searches", OrderPageSchema, query);
    }

    export function deleteOrders(ids: number[]) {
        return client.delete("/orders", z.number(), {params: {ids}});
    }

    export function deleteById(id: number) {
        return client.delete(`/orders/${id}`, z.number(),)
    }
}

namespace Mappers {
    const COUPON_FALL_BACK: Coupon = {
        id: 0,
        code: "UNKNOWN",
        minAmount: 0,
        maxAppliedAmount: 0,
        description: "",
        type: 'PERCENTAGE',
        value: 0,
        availableTo: new Date().toISOString(),
        availableFrom: new Date().toISOString(),
        usageLimit: 0
    }
    const USER_FALL_BACK: UserProfileDetailed = {
        id: 0,
        imageUrl: 'empty_img.png',
        createdAt: new Date().toISOString(),
        fullName: "Anonymous",
        email: "unknown@gmail",
        accountId: 0
    }

    export function fromOderDetailResponseToDomain(responseDetails: (OrderDetailResponse | null)[]): OrderDetail[] {
        return responseDetails.filter((od): od is OrderDetailResponse => od !== null).map(od => ({
            id: od.id ?? 0,
            originalPrice: od.originalPrice ?? 0,
            price: od.price ?? 0,
            product: od.product ?? {
                id: 0,
                name: "unknown",
                slug: "unknown",
                imageUrl: "/empty_img.png",
                originalPrice: 0,
                price: 0,
            },
            productId: od.product.id ?? 0,
            quantity: od.quantity ?? 0
        }))
    }

    export function fromOrderResponseToDomain(source: OrderResponse) {
        const target: Order = {
            id: source.id,
            coupon: source.coupon ?? COUPON_FALL_BACK,
            createdAt: source.createdAt,
            deletedAt: source.deletedAt ?? null,
            details: fromOderDetailResponseToDomain(source.details ?? []),
            orderStatus: source.status ?? 'PENDING',
            payment: source.payment ?? null,
            profile: source?.profile ?? USER_FALL_BACK,
            amount: source.amount,
            originalAmount: source.originalAmount,
        }
        return target;
    }
}


namespace Calculations {
    type OrderDetailMetas = { price: number, quantity: number }[]
    type CouponMeta = {
        type: string,
        value: number,
        maxAppliedAmount: number,
        minAmount: number,
        usageLimit: number
    } | null | undefined

    export function calculateGross(ods: OrderDetailMetas) {
        let gross = 0;
        ods.forEach(c => {
            gross += c.price * c.quantity
        });
        return gross;
    }

    export function calculateApplied(gross: number, coupon: CouponMeta) {
        if (coupon === null || typeof coupon === 'undefined')
            return 0
        if (coupon.usageLimit <= 0 || gross < coupon.minAmount || coupon.value < 0)
            return 0;

        if (coupon.usageLimit > 0) {
            if (coupon.type === 'PERCENTAGE') {
                return Math.min(coupon.maxAppliedAmount, gross * coupon.value);
            } else if (coupon.type === 'FIXED') {
                return gross - Math.min(coupon.maxAppliedAmount, coupon.value);
            }
        }
        return 0;
    }

    export function calculateAmounts(cartDetails: OrderDetailMetas, coupon: CouponMeta) {
        if (cartDetails.length === 0)
            return {gross: 0, applied: 0, net: 0};
        const gross = Calculations.calculateGross(cartDetails)
        const applied = Calculations.calculateApplied(gross, coupon);
        const net = gross - applied;
        return {gross, applied, net};
    }
}

