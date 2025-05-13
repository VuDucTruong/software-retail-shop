import {
  ApiClient,
  Product,
  ProductCreate,
  ProductItem,
  ProductItemDetail,
  ProductItemDetailList,
  ProductItemDetailListSchema,
  ProductList,
  ProductListSchema,
  ProductSchema,
  ProductUpdate,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { use } from "react";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductItemState = {
  productItems: ProductItemDetailList | null;
  selectedItem: ProductItemDetail | null;
  queryParams: QueryParams;

  lastAction: "create" | "update" | "delete" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductItemAction = {
  resetStatus: () => void;
  getProductItems: (query: QueryParams) => Promise<void>;
  deleteProductItems: (ids: number[]) => Promise<void>;
  createProductItems: (data: ProductItem[]) => Promise<void>;
};

type ProductItemStore = ProductItemState & ProductItemAction;

const initialState: ProductItemState = {
  productItems: null,
  selectedItem: null,
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
};

export const useProductItemStore = create<ProductItemStore>((set) => ({
  ...initialState,
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
  getProductItems: (query) => getProductItems(set, query),
  deleteProductItems: (ids) => deleteProductItems(set, ids),
  createProductItems: (data) => createProductitems(set, data),
}));

const getProductItems = async (
  set: SetState<ProductItemStore>,
  query: QueryParams
) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await productApiClient.post(
      "/products/items/searches",
      ProductItemDetailListSchema,
      query
    );
    set({ status: "success", productItems: response });
  } catch (error) {
    const apiError = error as ApiError;
    set({
      status: "error",
      error: apiError.message,
    });
  }
};

const handleDeleteReload= async (
  set: SetState<ProductItemStore>,
  ids: number[]
) => {
  const newData = useProductItemStore
    .getState()
    .productItems?.data?.filter((item) => !ids.includes(item.id));

  if (newData?.length === 0) {
    getProductItems(set, useProductItemStore.getState().queryParams);
    return;
  } else {
    set((state) => ({
      ...state,
      status: "success",
      productItems: state.productItems
        ? {
            ...state.productItems,
            data: newData || [],
            totalInstances: (state.productItems.totalInstances ?? ids.length) - ids.length,
          }
        : null,
    }));
  }
};


const deleteProductItems = async (
  set: SetState<ProductItemStore>,
  ids: number[]
) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    productApiClient.delete(
      "/products/items",
      z.number(),
      {
        params: {
          ids: ids.join(","),
        }
      }
    );
    handleDeleteReload(set, ids);
  } catch (error) {
    const apiError = error as ApiError;
    set({
      status: "error",
      error: apiError.message,
    });
  }
}

const createProductitems = async (
  set: SetState<ProductItemStore>,
  data: ProductItem[]
) => {
  set({ status: "loading", lastAction: "create", error: null });

  try {
   
    const response = await productApiClient.post(
      "/products/items",
      z.object({
        accepted: z.array(z.string())
      }),
      data
    );
     
     
  } catch (error) {
    const apiError = error as ApiError;
    set({
      status: "error",
      error: apiError.message,
    });
  }
}