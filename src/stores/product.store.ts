import {
  ApiClient,
  Coupon,
  CouponCreate,
  CouponList,
  CouponListSchema,
  CouponSchema,
  CouponUpdate,
  Product,
  ProductCreate,
  ProductList,
  ProductListSchema,
  ProductSchema,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { delay } from "@/lib/utils";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductState = {
  products: ProductList | null;
  selectedProduct: Product | null;
  queryParams: QueryParams;

  lastAction:  "create" | "update" | "delete" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductAction = {
  resetStatus: () => void;
  getProducts: (query: QueryParams) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  createProduct: (product: ProductCreate) => Promise<void>;
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

export const useProductStore = create<ProductStore>((set) => ({
  ...initialState,
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
  getProducts: (query) => getProducts(set, query),
  createProduct: (product) => createProduct(set, product),
  getProductById: (id) => getProductById(set, id),
}));

const getProducts = async (set: SetState<ProductStore>, query: QueryParams) => {
  set({ status: "loading", lastAction: null, error: null, queryParams: query });

  try {
    const response = await productApiClient.post(
      "/products/searches",
      ProductListSchema,
      query
    );
    set({ products: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getProductById = async (set: SetState<ProductStore>, id: number) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await productApiClient.get(
      `/products/${id}`,
      ProductSchema
    );
    set({ selectedProduct: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}


const createProduct = async (set: SetState<ProductStore>, product: ProductCreate) => {
  set({ status: "loading", lastAction: "create", error: null });

  try {
    const response = await productApiClient.post(
      "/products",
      ProductSchema,
      product
    );
    set({ selectedProduct: response, status: "success", lastAction: "create" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};