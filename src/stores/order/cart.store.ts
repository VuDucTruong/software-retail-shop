import {create} from "zustand";
import {CartMetaData} from '@/api/types/order_group/cartMetaData'
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
        const debouncedPersist = debounce(() => get()._persist(), 800);

        function persist(force: boolean | undefined) {
            if (force) return get()._persist();
            return debouncedPersist();
        }

        return {
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
                // console.log("value",{id, value})
                odm[id] = value;
                // console.log("odm", odm)
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

            removeItem: function (id, force = false) {
                set((state) => {
                    const rest = {...state.orderDetailsMeta};
                    delete rest[id];
                    return {orderDetailsMeta: rest};
                });
                persist(force);
            },

            clearItems() {
                set({orderDetailsMeta: {}});
                void get()._persist();
            },

            async _persist() {
                const odm = get().orderDetailsMeta;
                const current = JSON.stringify(odm);
                localStorage.setItem("cart", current);
            },
            async load() {
                const metaString = localStorage.getItem("cart") ?? "{}";
                // console.log("raw: ", metaString)
                const parsed = CartMetaData.LocalMetaSchema.safeParse(JSON.parse(metaString));
                // console.log("parsed: ", parsed)
                set({orderDetailsMeta: parsed.success ? parsed.data : {}});
            },
        };
    });
}













