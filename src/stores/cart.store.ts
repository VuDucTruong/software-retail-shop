import {ApiClient, Coupon, OrderCreate, OrderDetailList, ProductListSchema, QueryParams} from "@/api";
import {create} from "zustand";
import {SetState} from "@/lib/set_state";
import {ApiError} from "@/api/client/base_client";
import {Cart} from '@/api/types/order_group/cart'

const cartClient = ApiClient.getInstance();

namespace CartLocal {
    type State = {
        orderDetailsMeta: Cart.Local
        couponString: string,
    }
    type Action = {
        addItem: (id: Cart.LocalKey, qty: number) => void,
        setItem: (id: Cart.LocalKey, value: Cart.LocalValue) => void,
        subtractItem: (id: Cart.LocalKey, qty: number) => void,
        clearItems: () => void
        persist: () => Promise<void>
    }
    const initialState: State = {
        couponString: "",
        orderDetailsMeta: new Map(),
    }
    type Store = State & Action;
    export const useStore = create<Store>((set, get): Store => {
        const x: Store = {
            ...initialState,
            addItem(id: Cart.LocalKey, qty: number): void {
                const odm = new Map(get().orderDetailsMeta);
                const item = odm.get(id);
                if (item == null) {
                    odm.set(id, {qty: qty, name: ""});
                } else {
                    odm.set(id, {...item, qty: item.qty + qty}); // create new object, no mutation
                }
                set({orderDetailsMeta: odm});
            },
            subtractItem(id: Cart.LocalKey, qty: number): void {
                get().addItem(id, qty);
            },
            clearItems(): void {
                set({orderDetailsMeta: new Map(),})
            },
            async persist(): Promise<void> {
            },
            setItem(id: Cart.LocalKey, value: Cart.LocalValue): void {
                const odm = new Map(get().orderDetailsMeta);
                odm.set(id, value);
                set({orderDetailsMeta: odm});
            },
        }
        return x;
    });
}


namespace CartPage {
    type CartState = {
        orderDetails: OrderDetailList,
        gross: number,
        appliedDiscount: number,
        net: number,
        coupon: Coupon | null

        lastAction: "create" | "update" | "delete" | null,
        error: string | null,
        status: "idle" | "loading" | "success" | "error";
    }
    type CartAction = {
        calculateAmounts: () => void;
        dosth: (get: () => CartState) => void;
    }
    type CartStore = CartState & CartAction;

    const initState: CartState = {
        orderDetails: [],
        gross: 0,
        appliedDiscount: 0,
        net: 0,
        error: null,
        lastAction: null,
        status: "idle",
        coupon: null,
    }


    const getProductByIdIn = async (set: SetState<CartStore>, ids: number[]): Promise<void> => {
        set({lastAction: null, error: null, status: 'loading'});
        const requestPagination: QueryParams = {
            pageRequest: {
                page: 0,
                size: ids.length,
                sortBy: "id",
                sortDirection: "asc"
            },
            ids: ids
        }
        /// fetch

        try {
            const response = await cartClient.post("/products/searches",
                ProductListSchema,
                requestPagination
            ).then(s => {
                /// THEN SET THE products
                /// THEN SET The gross-net-applied
            })
        } catch (error) {
            const apiError = error as ApiError;
            set({error: apiError.message, status: 'loading'})
        }
    }
    export const useCartStore = create<CartStore>((set,) => ({
        ...initState,
        calculateAmounts: () => 0,
        dosth: (item) => {
        }
    }))

    const loadCartFromLocal = async (set: SetState<CartStore>): Promise<OrderCreate | null> => {
/// LOAD FROM LOCAL STORAGE HERE
        return null;
    };

}











