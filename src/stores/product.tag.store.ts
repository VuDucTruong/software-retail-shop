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
import { handleDeleteReloadGeneric } from "./reload.store";

const productApiClient = ApiClient.getInstance();

type TagState = {
  tags: string[] | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type TagAction = {
  getProductTags: () => Promise<void>;
};

type TagStore = TagState & TagAction;

const initialState: TagState = {
  tags: null,
  error: null,
  status: "idle",
};

export const useTagStore = create<TagStore>((set) => ({
  ...initialState,
  getProductTags: async () => {
    set({ status: "loading", error: null });

    try {
      const response = await productApiClient.get(
        "/products/tags",
        z.string().array()
      );
      set({ tags: response, status: "success" });
    } catch (error) {
      const appError = error as ApiError;
      set({ error: appError.message, status: "error" });
    }
  },
}));
