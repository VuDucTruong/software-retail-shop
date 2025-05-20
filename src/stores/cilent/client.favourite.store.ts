import {
  ApiClient,
  Product,
  ProductList,
  ProductListSchema,
  ProductSchema,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { urlToFile } from "@/lib/utils";
import { get } from "lodash";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductState = {
  products: Map<string, ProductList> | null;
  search: ProductList | null;
  selectedProduct: Product | null;
  queryParams: QueryParams;

  lastAction: "like" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductAction = {
  resetStatus: () => void;
  updateProductFavourite: (productId: number, isLike: boolean) => Promise<void>;
};

type ProductStore = ProductState & ProductAction;

const initialState: ProductState = {
  products: null,
  search: null,
  selectedProduct: null,
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

export const useClientFavouriteStore = create<ProductStore>((set) => ({
  ...initialState,
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
  updateProductFavourite: (productId, isLike) =>
    updateProductFavourite(set, productId, isLike),
}));

const updateProductFavourite = async (
  set: SetState<ProductStore>,
  productId: number,
  isLike: boolean
) => {
  set({ status: "loading", lastAction: "like", error: null });

  try {
    if (isLike) {
      await productApiClient.put(`/products/favorites`, z.any(), undefined, {
        params: { productId },
      });

      set({ status: "success" });

    } else {
      await productApiClient.delete(
        `/products/favorites`,
        z.any(),
        {
          params: { productId },
        }
      );
      set({ status: "success" });

    }
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
