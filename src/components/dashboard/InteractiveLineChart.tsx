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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { Skeleton } from "../ui/skeleton";
const chartData = Array.from({ length: 60 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  return {
    date: date.toISOString().split("T")[0],
    pending: Math.floor(Math.random() * 1000) + 500,
    processing: Math.floor(Math.random() * 1000) + 500,
    completed: Math.floor(Math.random() * 1000) + 500,
    canceled: Math.floor(Math.random() * 1000) + 500,
  };
}).reverse();



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
    key: "canceled",
    color: "var(--color-canceled)",
  },
];
export function InteractiveLineChart() {
  const t = useTranslations();


  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartConfig = {
    pending: {
      label: t('ORDER_STATUS.Pending'),
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
      label: t("ORDER_STATUS.Canceled"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 60;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });



  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{t('total_orders')}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {t('total_for_last_x_months' , {x: 2})}
          </span>
          <span className="@[540px]/card:hidden">{t('last_x_months' , {x: 2})}</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="flex"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
            {t('last_x_months' , {x: 2})}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              {t('last_x_days' , {x: 30})}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
            {t('last_x_days' , {x: 7})}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {
          mounted ? (<ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={filteredData} >
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                });
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
                    : config.key == "canceled"
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
        </ChartContainer>) : (
          <Skeleton className="h-80 w-full" />
        )
        }
      </CardContent>
    </Card>
  );
}
