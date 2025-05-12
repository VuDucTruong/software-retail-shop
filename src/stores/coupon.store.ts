import {
  ApiClient,
  Coupon,
  CouponCreate,
  CouponList,
  CouponListSchema,
  CouponSchema,
  CouponUpdate,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { delay } from "@/lib/utils";
import { get } from "http";
import { z } from "zod";

import { create } from "zustand";

const couponApiClient = ApiClient.getInstance();

type CouponState = {
  coupons: CouponList | null;
  selectedCoupon: Coupon | null;
  queryParams: QueryParams;

  lastAction:  "create" | "update" | "delete" | null;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
};

type CouponAction = {
  resetStatus: () => void;
  getCoupons: (query: QueryParams) => Promise<void>;
  createCoupon: (coupon: CouponCreate) => Promise<void>;
  getCouponById: (id: number) => Promise<void>;
  updateCoupon: (coupon: CouponUpdate) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;
  deleteCoupons: (ids: number[]) => Promise<void>;
};

type CouponStore = CouponState & CouponAction;

const initialState: CouponState = {
  coupons: null,
  selectedCoupon: null,
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

export const useCouponStore = create<CouponStore>((set) => ({
  ...initialState,
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
  getCoupons: (query) => getCoupons(set, query),
  createCoupon: (coupon) => createCoupon(set, coupon),
  getCouponById: (id) => getCouponById(set, id),
  updateCoupon: (coupon) => updateCoupon(set, coupon),
  deleteCoupon: (id) => deleteCoupon(set , id),
  deleteCoupons: (ids) => deleteCoupons(set, ids),
}));

const getCoupons = async (set: SetState<CouponStore>, query: QueryParams) => {
  set({ status: "loading", lastAction: null, error: null, queryParams: query });

  try {
    const response = await couponApiClient.post(
      "/coupons/searches",
      CouponListSchema,
      query
    );
    set({ coupons: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const createCoupon = async (
  set: SetState<CouponStore>,
  coupon: CouponCreate
) => {
  set({ status: "loading", lastAction: "create", error: null });

  try {
    const response = await couponApiClient.post(
      "/coupons",
      CouponSchema,
      coupon
    );
    set({ selectedCoupon: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}


const getCouponById = async (set: SetState<CouponStore>, id: number) => {
  set({ status: "loading", lastAction: null, error: null });

  try {
    const response = await couponApiClient.get(
      `/coupons`,
      CouponSchema,
      {
        params: {
          id,
        }
      }
    );
    set({ selectedCoupon: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const updateCoupon = async (
  set: SetState<CouponStore>,
  coupon: CouponUpdate
) => {
  set({ status: "loading", lastAction: "update", error: null });

  try {
    const response = await couponApiClient.put(
      `/coupons`,
      CouponSchema,
      coupon
    );
    set({ selectedCoupon: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}

const deleteCoupon = async (set: SetState<CouponStore>, id: number) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    const res = await couponApiClient.delete(`/coupons/${id}`, z.number(), );
    if(res > 0) {
      set({status: "success"});
       await delay(1000);
    } else {
      throw new ApiError("Xóa mã giảm giá thất bại");
    }
    getCoupons(set, useCouponStore.getState().queryParams);
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}

const deleteCoupons = async (set: SetState<CouponStore>, ids: number[]) => {
  set({ status: "loading", lastAction: "delete", error: null });

  try {
    const res = await couponApiClient.delete(`/coupons`, z.number(), {
      params: {
        params: { ids: ids.join(",") },
      }
    });
    if(res > 0) {
      set({status: "success"});
      await delay(1000);
    } else {
      throw new ApiError("Xóa mã giảm giá thất bại");
    }
     getCoupons(set, useCouponStore.getState().queryParams);
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
}