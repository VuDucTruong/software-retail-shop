'use client';

import { CommmonDataTable } from "@/components/CommonDataTable";


import { TransactionsFilterForm } from "@/components/transactions/TransactionsFilterForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertPriceToVND } from "@/lib/currency_helper";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React from "react";
import { z } from "zod";

export default function TransactionsPage() {
  const t = useTranslations();

  const scheme = z.object({
    time: z.string(),
    description: z.string(),
    amount: z.number().transform((val)=> convertPriceToVND(val)),
  });

  const cols:ColumnDef<z.infer<typeof scheme>>[] = [
    { header: t("Time"), accessorKey: "time" },
    { header: t('Description'), accessorKey: "description" },
    { header: t('Amount'), accessorKey: "amount" },
  ]

  const sampleData = Array.from({ length: 20 }, (_, i) => ({
    time: new Date().toLocaleDateString(),
    description: `Gói gia hạn Zoom Pro ${i + 1}`,
    amount: Math.floor(Math.random() * 100000),
  }));


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

          <CommmonDataTable columns={cols} data={scheme.array().parse(sampleData)} />
        </div>
      </CardContent>
    </Card>
  );
}
