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
  ProductUpdate,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { delay, urlToFile } from "@/lib/utils";
import { use } from "react";
import { z } from "zod";

import { create } from "zustand";

const productApiClient = ApiClient.getInstance();

type ProductState = {
  products: ProductList | null;
  selectedProduct: Product | null;
  queryParams: QueryParams;

  lastAction: "create" | "update" | "delete" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type ProductAction = {
  resetStatus: () => void;
  getProducts: (query: QueryParams) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  createProduct: (product: ProductCreate) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteProducts: (ids: number[]) => Promise<void>;
  updateProduct: (product: ProductUpdate) => Promise<void>;
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
  deleteProduct: (id) => deleteProduct(set, id),
  deleteProducts: (ids) => deleteProducts(set, ids),
  updateProduct: (product) => updateProduct(set, product),
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
      `/products`,
      ProductSchema,
      {
        params: { id },
      }
    );

    response.image = await urlToFile(
      response.imageUrl ?? "")

    set({ selectedProduct: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const createProduct = async (
  set: SetState<ProductStore>,
  product: ProductCreate
) => {
  set({ status: "loading", lastAction: "create", error: null });

  try {
    const response = await productApiClient.post(
      "/products",
      ProductSchema,
      product,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    set({ selectedProduct: response, status: "success", lastAction: "create" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const handleDeleteReload= async (
  set: SetState<ProductStore>,
  ids: number[]
) => {
  const newData = useProductStore
    .getState()
    .products?.data?.filter((product) => !ids.includes(product.id));

  if (newData?.length === 0) {
    getProducts(set, useProductStore.getState().queryParams);
    return;
  } else {
    set((state) => ({
      ...state,
      status: "success",
      products: state.products
        ? {
            ...state.products,
            data: newData || [],
          }
        : null,
    }));
  }
};

const deleteProduct = async (set: SetState<ProductStore>, id: number) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    handleDeleteReload(set, [id]);
    await productApiClient.delete(`/products/${id}`, z.number(), {
      params: { id },
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const deleteProducts = async (set: SetState<ProductStore>, ids: number[]) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    handleDeleteReload(set, ids);
    await productApiClient.delete("/products", z.number(), {
      params: {
        ids: ids.join(","),
      },
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const updateProduct = async (
  set: SetState<ProductStore>,
  product: ProductUpdate
) => {
  set({ status: "loading", lastAction: "update", error: null });

  try {
    const response = await productApiClient.put(
      `/products`,
      ProductSchema,
      product,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    set({ selectedProduct: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
