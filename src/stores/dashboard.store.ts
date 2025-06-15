import {
  ApiClient,
  OrderStatistic,
  OrderStatisticSchema,
  ProductTrend,
  ProductTrendSchema,
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
  productTrends: ProductTrend[] | null;
  queryParams: StatisticQuery;

  error: string | null;
};

type DashboardAction = {
  getTotalStatistic: (query?: StatisticQuery) => Promise<void>;
  getOrderStatistic: (query?: StatisticQuery) => Promise<void>;
  getProductTrends: (size?: number) => Promise<void>;
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
  getProductTrends: (size) => getProductTrends(set, size),
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
  size: number = 10
) => {
  try {
    const response = await apiClient.get(
      "/products/trends",
      z.array(ProductTrendSchema),
      {
        params: {
          size: size,
        },
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