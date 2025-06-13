"use client";

import * as React from "react";
import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getDatePickerLocale,
  getStatisticDate
} from "@/lib/date_helper";
import { useDashboardStore } from "@/stores/dashboard.store";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";

const barConfig = [
  {
    key: "pending",
    color: "var(--color-pending)",
  },
  {
    key: "processing",
    color: "var(--color-processing)",
  },
  {
    key: "completed",
    color: "var(--color-completed)",
  },
  {
    key: "failed",
    color: "var(--color-canceled)",
  },
];
export function InteractiveLineChart() {
  const t = useTranslations();
  const locale = useLocale();
  const datePickerLocale = React.useMemo(() => {
    return getDatePickerLocale(locale);
  }, [locale]);
  const [orderStatistic, getOrderStatistic, query] = useDashboardStore(
    useShallow((state) => [
      state.orderStatistic,
      state.getOrderStatistic,
      state.queryParams,
    ])
  );

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartConfig = {
    pending: {
      label: t("ORDER_STATUS.Pending"),
      color: "var(--chart-1)",
    },
    processing: {
      label: t("ORDER_STATUS.Processing"),
      color: "var(--chart-2)",
    },
    completed: {
      label: t("ORDER_STATUS.Completed"),
      color: "var(--chart-3)",
    },
    canceled: {
      label: t("ORDER_STATUS.Failed"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  React.useEffect(() => {
    getOrderStatistic(query);
  }, [getOrderStatistic,query]);

  const chartData = React.useMemo(() => {
    if (!orderStatistic) return [];
    return orderStatistic
      .map((item) => ({
        date: item.localDate,
        pending: item.pending,
        processing: item.processing,
        completed: item.completed,
        failed: item.failed,
      }))
      .reverse();
  }, [orderStatistic]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{t("total_orders")}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {t("total_orders_from_x_to_y", {
              x: format(query.from ?? new Date(), "PP", {
                locale: datePickerLocale,
              }),
              y: format(query.to ?? new Date(), "PP", {
                locale: datePickerLocale,
              }),
            })}
          </span>
          <span className="@[540px]/card:hidden">
            {t("last_x_months", { x: 2 })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {mounted ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  return getStatisticDate(locale, value);
                }}
              />
              {barConfig.map((config) => (
                <Bar
                  key={config.key}
                  dataKey={config.key}
                  stackId="a"
                  fill={config.color}
                  radius={
                    config.key === "pending"
                      ? [0, 0, 4, 4]
                      : config.key == "failed"
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <Skeleton className="h-80 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
