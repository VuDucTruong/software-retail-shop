import {
  ApiClient,
  OrderStatistic,
  OrderStatisticSchema,
  ProductTrend,
  ProductTrendSchema,
  SimpleProductTrend,
  SimpleProductTrendSchema,
  StatisticQuery,
  StatisticQuerySchema,
  TotalStatistic,
  TotalStatisticSchema
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";

import { create } from "zustand";

const apiClient = ApiClient.getInstance();

type DashboardState = {
  totalStatistic: TotalStatistic | null;
  orderStatistic: OrderStatistic[] | null;
  productTrends: SimpleProductTrend[] | null;
  queryParams: StatisticQuery;

  error: string | null;
};

type DashboardAction = {
  getTotalStatistic: (query?: StatisticQuery) => Promise<void>;
  getOrderStatistic: (query?: StatisticQuery) => Promise<void>;
  getProductTrends: (query?: StatisticQuery) => Promise<void>;
  setQueryParams: (queryParams: StatisticQuery) => void;
};

type DashboardStore = DashboardState & DashboardAction;

const initialState: DashboardState = {
  totalStatistic: null,
  orderStatistic: null,
  productTrends: null,
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
  query?: StatisticQuery,
) => {
  try {
    const response = await apiClient.get(
      "/statistics/trends",
      z.array(SimpleProductTrendSchema),
      {
        params: 
          query

      }
    );

    set(prev => ({
      ...prev,
      productTrends: response,
    }));
  } catch (error) {
    set({
      error: ApiError.getMessage(error),
    });
  }
}