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
  getProducts: (query: QueryParams, name: string) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<void>;
  searchProducts: (query: QueryParams) => Promise<void>;
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

export const useClientProductStore = create<ProductStore>((set) => ({
  ...initialState,
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
  getProducts: (query, name) => getProducts(set, query, name),
  getProductBySlug: (slug) => getProductBySlug(set, slug),
  searchProducts: (query) => searchProducts(set, query),
}));

const getProducts = async (
  set: SetState<ProductStore>,
  query: QueryParams,
  name: string
) => {
  set({ status: "loading", lastAction: null, error: null, queryParams: query });

  try {
    const response = await productApiClient.post(
      "/products/searches",
      ProductListSchema,
      query
    );
    // set products
    set((state) => ({
      products: new Map([
        ...Array.from(state.products?.entries() ?? []),
        [name, response],
      ]),
      status: "success",
    }));
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getProductBySlug = async (set: SetState<ProductStore>, slug: string) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await productApiClient.get(`/products`, ProductSchema, {
      params: { slug },
    });

    response.image = await urlToFile(response.imageUrl ?? "");

    set({ selectedProduct: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

export const searchProducts = async (
  set: SetState<ProductStore>,
  query: QueryParams
) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await productApiClient.post(
      "/products/searches",
      ProductListSchema,
      query
    );

    set({ search: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
