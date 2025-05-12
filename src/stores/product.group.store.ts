import { ApiClient, ProductGroup, ProductGroupCreate, ProductGroupSchema, QueryParams } from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";
import { create } from "zustand";

const productGroupApiClient = ApiClient.getInstance();

type ProductGroupState = {
    productGroups: ProductGroup[] | null;
    selectedProductGroup: ProductGroup | null;
    queryParams: QueryParams;
    
    lastAction: "create" | "update" | "delete" | null;
    error: string | null;
    status: "idle" | "loading" | "success" | "error";
}


type ProductGroupAction = {
    resetStatus: () => void;
    getProductGroups: () => Promise<void>;
    createProductGroup: (group: ProductGroupCreate) => Promise<void>;
}

type ProductGroupStore = ProductGroupState & ProductGroupAction;

const initialState: ProductGroupState = {
    productGroups: null,
    selectedProductGroup: null,
    queryParams: {
        pageRequest: {
            page: 0,
            size: 10,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    },
    lastAction: null,
    error: null,
    status: "idle",
}

export const useProductGroupStore = create<ProductGroupStore>((set) => ({
    ...initialState,
    resetStatus: () =>
        set((state) => ({
            ...state,
            status: "idle",
            lastAction: null,
            error: null,
        })),
    getProductGroups: () => getProductGroups(set),
    createProductGroup: (group) => createProductGroup(set, group),
}));


const getProductGroups = async (set: SetState<ProductGroupStore>) => {
    set({ status: "loading", lastAction: null, error: null });
    try {
        const response = await productGroupApiClient.get("/products/groups" , z.array(ProductGroupSchema));
        set({ productGroups: response, status: "success" });
    } catch (error) {
        set({ status: "error", error: (error as ApiError).message });
    }
}

const createProductGroup = async (set: SetState<ProductGroupStore>, group: ProductGroupCreate) => {
    set({ status: "loading", lastAction: "create", error: null });
    try {
        const response = await productGroupApiClient.post("/products/groups", ProductGroupSchema , group);
        set({ productGroups: [...(useProductGroupStore.getState().productGroups || []), response], status: "success" });
    } catch (error) {
        set({ status: "error", error: (error as ApiError).message });
    }
}