"use client";

import CardSection from "@/components/dashboard/CardSection";
import { InteractiveLineChart } from "@/components/dashboard/InteractiveLineChart";

import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import DashboardFilterForm from "@/components/dashboard/DashboardFilterForm";

type ProductTrend = {
  produt: {
    id: number;
    name: string;
  };
  saleCount: number;
};

export default function DashboardPage() {
  const t = useTranslations();

  const cols: ColumnDef<ProductTrend>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return row.original.produt.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("product_name"),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/products/${row.original.produt.id}`}>
            <Button variant={"link"} className="text-left w-full">
              {row.original.produt.name}
            </Button>
          </Link>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "saleCount",
      header: t("sale_count"),
      cell: ({ row }) => {
        return row.original.saleCount;
      },
      enableHiding: true,
    },
  ];

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
      <InteractiveLineChart />
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{t("top_selling_products")}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommmonDataTable columns={cols} data={[]} />
        </CardContent>
      </Card>
    </div>
  );
}
