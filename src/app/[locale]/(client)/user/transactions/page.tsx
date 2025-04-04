'use client';

import { OrdersFilterForm } from "@/components/orders/OrdersFilterForm";
import OrderTable from "@/components/orders/OrderTable";
import SimpleTable from "@/components/SimpleTable";
import { TransactionsFilterForm } from "@/components/transactions/TransactionsFilterForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { CustomerOrderItem } from "@/types/customer_order_item";
import { useTranslations } from "next-intl";
import React from "react";
import { IoFilter } from "react-icons/io5";

export default function TransactionsPage() {
  const t = useTranslations();

  const cols = [
    { header: t("Time"), accessorKey: "time" },
    { header: t('Description'), accessorKey: "description" },
    { header: t('Amount'), accessorKey: "amount" },
  ]


  return (
    <Card>
      <CardHeader>
        <h3>{t("transaction_history")}</h3>
        <p className="font-normal italic text-muted-foreground">{t("transaction_history_description")}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="divider"></div>
          <TransactionsFilterForm />

          <SimpleTable columns={cols} data={sampleOrderItems} />
        </div>
      </CardContent>
    </Card>
  );
}
