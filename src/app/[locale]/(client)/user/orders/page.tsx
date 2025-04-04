"use client";

import { OrdersFilterForm } from "@/components/orders/OrdersFilterForm";
import OrderTable from "@/components/orders/OrderTable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { CustomerOrderItem } from "@/types/customer_order_item";
import { useTranslations } from "next-intl";
import React from "react";
import { IoFilter } from "react-icons/io5";

export default function OrderPage() {
  const t = useTranslations();

  const cols = [
    { header: t("Time"), accessorKey: "time" as keyof CustomerOrderItem },
    {
      header: t("order_id"),
      accessorKey: "order_id" as keyof CustomerOrderItem,
    },
    { header: t("Product"), accessorKey: "product" as keyof CustomerOrderItem },
    {
      header: t("Quantity"),
      accessorKey: "quantity" as keyof CustomerOrderItem,
    },
    { header: t("Total"), accessorKey: "total" as keyof CustomerOrderItem },
    { header: t("Status"), accessorKey: "status" as keyof CustomerOrderItem },
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

          <OrderTable columns={cols} data={sampleOrderItems} />
        </div>
      </CardContent>
    </Card>
  );
}
