import {
  ApiClient,
  OrderStatistic,
  OrderStatisticSchema,
  Product,
  ProductCreate,
  ProductList,
  ProductListSchema,
  ProductSchema,
  ProductUpdate,
  QueryParams,
  StatisticQuery,
  StatisticQuerySchema,
  TotalStatistic,
  TotalStatisticSchema,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { queryObjects } from "v8";
import { z } from "zod";

import { create } from "zustand";

const apiClient = ApiClient.getInstance();

type DashboardState = {
  totalStatistic: TotalStatistic | null;
  orderStatistic: OrderStatistic[] | null;
  queryParams: StatisticQuery;

  error: string | null;
};

type DashboardAction = {
  getTotalStatistic: (query?: StatisticQuery) => Promise<void>;
  getOrderStatistic: (query?: StatisticQuery) => Promise<void>;
  getProductTrends: (query?: QueryParams) => Promise<void>;
  setQueryParams: (queryParams: StatisticQuery) => void;
};

type DashboardStore = DashboardState & DashboardAction;

const initialState: DashboardState = {
  totalStatistic: null,
  orderStatistic: null,
  queryParams: StatisticQuerySchema.parse({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  }),
  error: null,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,
  getTotalStatistic: (query) => getTotalStatistic(set, query),
  getOrderStatistic: (query) => getOrderStatistic(set, query),
  setQueryParams: (queryParams) =>
    set({queryParams: queryParams}),
  getProductTrends: (query) => getProductTrends(set, query),
}));

async function getTotalStatistic(
  set: SetState<DashboardStore>,
  query?: StatisticQuery
) {
  try {
    const response = await apiClient.get(
      "/statistics/totals",
      TotalStatisticSchema,
      {
        params: query,
      }
    );
    set({
      totalStatistic: response,
    });
  } catch (error) {
    set({
      error: ApiError.getMessage(error),
    });
  }
}

async function getOrderStatistic(
  set: SetState<DashboardStore>,
  query?: StatisticQuery
) {
  try {
    const response = await apiClient.get(
      "/statistics/orders",
      z.array(OrderStatisticSchema),
      {
        params: query,
      }
    );
    set({
      orderStatistic: response,
    });
  } catch (error) {
    set({
      error: ApiError.getMessage(error),
    });
  }
}

const getProductTrends = async (
  set: SetState<DashboardStore>,
  query?: QueryParams
) => {
  // try {
  //   const response = await apiClient.get(
  //     "/statistics/product-trends",
  //     ,
  //     {
  //       params: query,
  //     }
  //   );
  //   set({
  //     productTrends: response,
  //   });
  // } catch (error) {
  //   set({
  //     error: ApiError.getMessage(error),
  //   });
  // }
}