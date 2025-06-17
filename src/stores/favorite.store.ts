import {create} from "zustand";
import {ApiClient} from "@/api";
import {z} from "zod";


export namespace FavoriteDomain {

    type State = {
        ids: Set<number>
    }
    type Action = {
        getFavorite(): Promise<void>
    }
    export type Store = State & Action;
    const initialValues: State = {
        ids: new Set(),
    }

    export const useStore = create<Store>((set) => ({
        ...initialValues,
        async getFavorite(): Promise<void> {
            const response = await FavoriteApis.getFavoriteIds();
            set({ids: new Set(response)})
        }
    }))
}

export namespace FavoriteApis {
    const apiClient = ApiClient.getInstance();
    export const FavoriteIdsSchema = z.array(z.number());

    export async function getFavoriteIds() {
        return apiClient.get("products/favorites/ids", FavoriteIdsSchema);
    }
}