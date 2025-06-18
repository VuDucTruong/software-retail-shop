import {create} from "zustand";
import {CartMetaData} from '@/api/types/order_group/cartMetaData'
import {z} from "zod";
import {debounce} from "lodash";

export namespace CartLocal {
    // Add `force` flag (default false) to all actions that mutate state
    type State = {
        orderDetailsMeta: CartMetaData.Local;
        couponString: string;
    };

    type Action = {
        addItem: (id: CartMetaData.LocalKey, qty: number, force?: boolean) => void;
        setItem: (id: CartMetaData.LocalKey, value: CartMetaData.LocalValue, force?: boolean) => void;
        subtractItem: (id: CartMetaData.LocalKey, qty: number, force?: boolean) => void;
        removeItem: (id: CartMetaData.LocalKey, force?: boolean) => void;
        clearItems: (force?: boolean) => void;  // optional force, defaults false
        _persist(): Promise<void>;
        load(): Promise<void>;
    };

    const initialState: State = {
        couponString: "",
        orderDetailsMeta: {},
    };

    type Store = State & Action;

    export const useStore = create<Store>((set, get): Store => {
        let lastPersisted: string | null = null;
        const debouncedPersist = debounce(() => get()._persist(), 800);

        function persist(force: boolean | undefined) {
            if (force) return get()._persist();
            return debouncedPersist();
        }

        const x: Store = {
            ...initialState,

            addItem(id, qty, force = false) {
                const odm = {...get().orderDetailsMeta};
                const item = odm[id];
                if (item == null) {
                    odm[id] = {qty, name: ""};
                } else {
                    odm[id] = {...item, qty: item.qty + qty};
                }
                set({orderDetailsMeta: odm});
                persist(force);
            },

            setItem(id, value, force = false) {
                const odm = {...get().orderDetailsMeta};
                odm[id] = value;
                set({orderDetailsMeta: odm});
                persist(force);
            },

            subtractItem(id, qty, force = false) {
                const odm = {...get().orderDetailsMeta};
                const item = odm[id];
                if (!item) return;
                const newQty = item.qty - qty;
                if (newQty <= 0) {
                    delete odm[id];
                } else {
                    odm[id] = {...item, qty: newQty};
                }
                set({orderDetailsMeta: odm});
                persist(force);
            },

            removeItem(id, force = false) {
                set((state) => {
                    const { [id]: _, ...rest } = state.orderDetailsMeta;
                    return { orderDetailsMeta: rest };
                });
                persist(force);
            },

            clearItems(force = false) {
                set({orderDetailsMeta: {}});
                get()._persist();
            },

            async _persist() {
                const odm = get().orderDetailsMeta;
                const current = JSON.stringify(odm);
                localStorage.setItem("cart", current);
                lastPersisted = current;
            },
            async load() {
                const metaString = localStorage.getItem("cart") ?? "{}";
                const parsed = CartMetaData.LocalMetaSchema.safeParse(JSON.parse(metaString));
                set({orderDetailsMeta: parsed.success ? parsed.data : {}});
            },
        };

        return x;
    });
}













