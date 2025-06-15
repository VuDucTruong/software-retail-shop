"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getCurrentMY } from "@/lib/date_helper"
import { useLocale, useTranslations } from "next-intl"
const chartData = [
  { status: "Active", customers: 275, fill: "var(--status-active)" },
  { status: "Inactive", customers: 200, fill: "var(--status-inactive)" },
  { status: "Banned", customers: 287, fill: "var(--status-banned)" },
]

const chartConfig = {
  visitors: {
    label: "Customers",
  },
  active: {
    label: "Active",
  },
  inactive: {
    label: "Inactive for 30 days",
  },
  banned: {
    label: "Banned",
  },
} satisfies ChartConfig

export function CustomerPieChart() {
  const t = useTranslations()
  const locale = useLocale();
  const totalCustomers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.customers, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center pb-0 border-b-0">
        <CardTitle>{t('customer_activity')}</CardTitle>
        <CardDescription>{getCurrentMY(locale)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="customers"
              nameKey="status"
              innerRadius={45}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCustomers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t('customers')}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm border-t-0">
        <div className="flex items-center gap-2 font-medium leading-none">
          {t('trending_up_by_x_this_month',{x:2.3})} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
