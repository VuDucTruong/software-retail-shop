"use client";

import CardSection from "@/components/dashboard/CardSection";
import { InteractiveLineChart } from "@/components/dashboard/InteractiveLineChart";

import React from "react";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableCellViewer from "@/components/dashboard/TableCellViewer";
import { StatusBadge } from "@/components/common/StatusBadge";
import { z } from "zod";
import { convertPriceToVND } from "@/lib/currency_helper";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";




export default function Page() {
  const t = useTranslations();
  const scheme = z.object({
    id: z.number(),
    purchaser: z.string(),
    status: z.string(),
    total: z.number().transform((val) => convertPriceToVND(val)),
    recipent: z.string(),
    createdAt: z.string(),
  });
  const cols: ColumnDef<z.infer<typeof scheme>>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        return <Link className="hover:underline font-medium" href={`orders/${row.original.id}`}>{row.original.id}</Link>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "purchaser",
      header: "Purchaser",
      cell: ({ row }) => <div className="w-32">{row.original.purchaser}</div>,
    },
    {
      accessorKey: "recipent",
      header: "Recipent",
      cell: ({ row }) => <div>{row.original.recipent}</div>,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status="canceled" />,
    },
    {
      accessorKey: "total",
      header: () => <div>Target</div>,
      cell: ({ row }) => <div>{row.original.total}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div>Create At</div>,
      cell: ({ row }) => <div>{row.original.createdAt}</div>,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <CardSection />
      <InteractiveLineChart />
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{t('lastest_orders')}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommmonDataTable
            columns={cols}
            data={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
