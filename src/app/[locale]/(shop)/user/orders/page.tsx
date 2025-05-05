"use client";

import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { OrdersFilterForm } from "@/components/orders/OrdersFilterForm";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { convertPriceToVND } from "@/lib/currency_helper";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { z } from "zod";

export default function OrderPage() {
  const t = useTranslations();

  const scheme = z.object({
    time: z.string(),
    order_id: z.string(),
    product: z.string(),
    quantity: z.number(),
    total: z.number().transform((val) => convertPriceToVND(val)),
    status: z.string(),

  });

  const cols: ColumnDef<z.infer<typeof scheme>>[] = [
    { header: t("Time"), accessorKey: "time"},
    {
      header: t("order_id"),
      accessorKey: "order_id",
    },
    { header: t("Product"), accessorKey: "product"},
    {
      header: t("Quantity"),
      accessorKey: "quantity",
      cell: ({row}) => <div className="text-center">{row.original.quantity}</div>
    },
    { header: t("Total"), accessorKey: "total" },
    { header: t("Status"), accessorKey: "status",cell: (cell) => {
      const status = cell.getValue();
      return (
        <StatusBadge status="pending" />
      );
    },}
  ];

  return (
    <Card>
      <CardHeader>
        <h3>{t("order_history")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("order_history_description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="divider"></div>
          <OrdersFilterForm />

          <CommmonDataTable
            columns={cols}
            data={scheme.array().parse(sampleOrderItems)}
            hasActions
            renderActions={(row) => (
              <Link href="orders/[id]" as={`orders/${row.order_id}`}>
                <Button variant={"link"}>{t("Detail")}</Button>
              </Link>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
