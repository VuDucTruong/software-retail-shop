"use client";

import CardSection from "@/components/dashboard/CardSection";
const InteractiveLineChart = React.lazy(
  () => import("@/components/dashboard/InteractiveLineChart")
);
import DashboardFilterForm from "@/components/dashboard/DashboardFilterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import ProductTrendTable from "@/components/dashboard/ProductTrendTable";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("Dashboard")}</h2>
          <p className="text-muted-foreground">{t("dashboard_description")}</p>
        </div>

        <DashboardFilterForm />
      </div>
      <CardSection />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <InteractiveLineChart />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{t("top_selling_products")}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTrendTable />
        </CardContent>
      </Card>
    </div>
  );
}
