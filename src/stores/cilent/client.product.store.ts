import {
  ApiClient,
  Product,
  ProductList,
  ProductListSchema,
  ProductSchema,
  ProductTrend,
  ProductTrendSchema,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { urlToFile } from "@/lib/utils";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductState = {
  products: Map<string, ProductList>;
  search: ProductList | null;
  selectedProduct: Product | null;
  queryParams: QueryParams;
  productTrend: ProductTrend[] | null;

  lastAction: "like" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductAction = {
  resetStatus: () => void;
  getProducts: (query: QueryParams, name: string) => Promise<void>; // name is used to differentiate between different product lists
  getProductBySlug: (slug: string) => Promise<void>;
  searchProducts: (query: QueryParams) => Promise<void>;
  getProductTrending: (size?: number) => Promise<void>;
};

type ProductStore = ProductState & ProductAction;

const initialState: ProductState = {
  products: new Map<string, ProductList>(),
  productTrend: null,
  search: null,
  selectedProduct: null,
  queryParams: {
    pageRequest: {
      page: 0,
      size: 8,
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
  getProductTrending: (size) => getProductTrending(set , size)
}));

const getProducts = async (
  set: SetState<ProductStore>,
  query: QueryParams,
  name: string
) => {
  set((state) => ({
     status: "loading", error: null , queryParams: {
    ...state.queryParams,
    ...query,
     }
  }));

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


const getProductTrending = async (
  set: SetState<ProductStore>,
  size: number = 8
) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await productApiClient.get(
      `/products/trends`,
      z.array(ProductTrendSchema),
      {
        params: {
          size: size,
        }
      }
    );

    set({
      productTrend: response,
      status: "success",
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}