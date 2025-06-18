import {
  ApiClient,
  Product,
  ProductList,
  ProductListSchema,
  QueryParams
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductState = {
  products: ProductList | null;
  selectedProduct: Product | null;
  queryParams: QueryParams;

  lastAction: "like" | "unlike" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductAction = {
  resetStatus: () => void;
  updateProductFavourite: (productId: number, isLike: boolean) => Promise<void>;
  getFavouriteProducts: (query: QueryParams) => Promise<void>;
};

type ProductStore = ProductState & ProductAction;

const initialState: ProductState = {
  products: null,
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
  getFavouriteProducts: (query) => getFavouriteProducts(set, query),
  updateProductFavourite: (productId, isLike) =>
    updateProductFavourite(set, productId, isLike),
}));

const updateProductFavourite = async (
  set: SetState<ProductStore>,
  productId: number,
  isLike: boolean
) => {
  set({
    status: "loading",
    lastAction: isLike ? "like" : "unlike",
    error: null,
  });

  try {
    if (isLike) {
      await productApiClient.put(`/products/favorites`, z.any(), undefined, {
        params: { productId },
      });

      set({ status: "success" });
    } else {
      await productApiClient.delete(`/products/favorites`, z.any(), {
        params: { productId },
      });

      if (isLike) {
        set((state) => ({
          ...state,
          status: "success"
        }));
      } else {
        set((state) => ({
          ...state,
          status: "success",
          products: state.products
            ? {
                ...state.products,
                data: state.products.data.filter(
                  (product) => product.id !== productId
                ),
              }
            : null,
        }));
      }
    }
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getFavouriteProducts = async (
  set: SetState<ProductStore>,
  query: QueryParams
) => {
  set((state) => ({
    ...state,
    status: "loading",
    error: null,
    queryParams: {
    ...state.queryParams,
    ...query,
    },
  }));

  try {
    const response = await productApiClient.get(
      `/products/favorites`,
      ProductListSchema,
      {
        params: {
          page: query?.pageRequest?.page || 0,
          size: query?.pageRequest?.size || 10,
        },
      }
    );

    set({
      products: response,
      status: "success",
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
