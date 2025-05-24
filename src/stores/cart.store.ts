import {create} from "zustand";
import {CartMetaData} from '@/api/types/order_group/cartMetaData'

namespace CartLocal {
    type State = {
        orderDetailsMeta: CartMetaData.Local
        couponString: string,
    }
    type Action = {
        addItem: (id: CartMetaData.LocalKey, qty: number) => void,
        setItem: (id: CartMetaData.LocalKey, value: CartMetaData.LocalValue) => void,
        subtractItem: (id: CartMetaData.LocalKey, qty: number) => void,
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
            addItem(id: CartMetaData.LocalKey, qty: number): void {
                const odm = new Map(get().orderDetailsMeta);
                const item = odm.get(id);
                if (item == null) {
                    odm.set(id, {qty: qty, name: ""});
                } else {
                    odm.set(id, {...item, qty: item.qty + qty}); // create new object, no mutation
                }
                set({orderDetailsMeta: odm});
            },
            subtractItem(id: CartMetaData.LocalKey, qty: number): void {
                get().addItem(id, qty);
            },
            clearItems(): void {
                set({orderDetailsMeta: new Map(),})
            },
            async persist(): Promise<void> {
            },
            setItem(id: CartMetaData.LocalKey, value: CartMetaData.LocalValue): void {
                const odm = new Map(get().orderDetailsMeta);
                odm.set(id, value);
                set({orderDetailsMeta: odm});
            },
        }
        return x;
    });
}










