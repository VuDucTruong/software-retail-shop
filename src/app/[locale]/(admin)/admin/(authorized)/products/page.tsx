"use client";

import { CommmonDataTable } from "@/components/CommonDataTable";
import TableCellViewer from "@/components/dashboard/TableCellViewer";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertPriceToVND } from "@/lib/currency_helper";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { CgAdd } from "react-icons/cg";
import { z } from "zod";

export default function ProductManagementPage() {
  const t = useTranslations();
  const scheme = z.object({
    id: z.string(),
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
        return <TableCellViewer />;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3>{t("product_management")}</h3>
          <div className="flex items-center gap-2">
            <Link href={"products/create"}>
            <Button variant="outline" className="bg-primary text-white">
              <CgAdd /> {t("add_product")}
            </Button></Link>
            <ProductFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable columns={cols} data={[]} canSelect hasActions />
      </CardContent>
    </Card>
  );
}
