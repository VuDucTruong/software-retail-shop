import {
  ApiClient,
  ProductItem,
  ProductItemDetail,
  ProductItemDetailList,
  ProductItemDetailListSchema,
  ProductItemSchema,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";

import { create } from "zustand";
import { handleDeleteReloadGeneric } from "./reload.store";

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
  createProductItems: (data: ProductItemDetail[]) => Promise<void>;
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
  set({ error: null });

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

const deleteProductItems = async (
  set: SetState<ProductItemStore>,
  ids: number[]
) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    const res = await productApiClient.delete("/products/items", z.number(), {
      params: {
        ids: ids.join(","),
      },
    });

    if (res <= 0) {
      throw new ApiError("Xóa khóa sản phẩm thất bại");
    } else {
      handleDeleteReloadGeneric(
        set,
        ids,
        "productItems",
        useProductItemStore.getState,
        getProductItems
      );
    }
  } catch (error) {
    const apiError = error as ApiError;
    set({
      status: "error",
      error: apiError.message,
    });
  }
};

const createProductitems = async (
  set: SetState<ProductItemStore>,
  data: ProductItemDetail[]
) => {
  set({ status: "loading", lastAction: "create", error: null });

  try {
    const createData = data.map((item) => ({
      productId: item.productId,
      productKey: item.productKey,
      region: item.region,
    }));

    const response = await productApiClient.post(
      "/products/items",
      z.object({
        productItemDetails: z.array(ProductItemSchema),
      }),
      createData
    );

    if (response) {
      const newData = data.filter((item) => {
        return response.productItemDetails.some(
          (newItem) =>
            newItem.productKey === item.productKey &&
            newItem.productId === item.productId
        );
      });

      const newProductItems = newData.map((item) => {
        const selectedProduct = response.productItemDetails.find(
          (product) =>
            product.productKey === item.productKey &&
            product.productId === item.productId
        );

        return {
          ...item,
          id: selectedProduct?.id || -1,
        };
      });

      set((state) => {
        return {
          ...state,
          productItems: {
            ...state.productItems,
            data: [
              ...newProductItems,
              ...(state.productItems?.data || []),
            ].slice(
              0,
              useProductItemStore.getState().queryParams?.pageRequest?.size ??
                10
            ),
            totalInstances:
              (state.productItems?.totalInstances || 0) +
              newProductItems.length,
          },
          status: "success",
        };
      });
    } else {
      throw new ApiError("Tạo khóa sản phẩm thất bại");
    }
  } catch (error) {
    const apiError = error as ApiError;
    set({
      status: "error",
      error: apiError.message,
    });
  }
};
