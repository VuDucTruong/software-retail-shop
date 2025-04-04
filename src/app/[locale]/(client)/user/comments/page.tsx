"use client";

import { CommentsFilterForm } from "@/components/comments/CommentsFilterForm";
import SimpleTable from "@/components/SimpleTable";
import { TransactionsFilterForm } from "@/components/transactions/TransactionsFilterForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { useTranslations } from "next-intl";
import React from "react";

export default function CommentsPage() {
  const t = useTranslations();

  const cols = [
    { header: t("Time"), accessorKey: "time" },
    { header: t("Description"), accessorKey: "description" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3>{t("my_comments")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("my_comments_description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="divider"></div>
          <CommentsFilterForm />

          <SimpleTable columns={cols} data={sampleOrderItems} />
        </div>
      </CardContent>
    </Card>
  );
}
