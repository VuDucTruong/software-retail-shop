"use client";

import { CommentsFilterForm } from "@/components/comments/CommentsFilterForm";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { useTranslations } from "next-intl";
import React from "react";
import { z } from "zod";

export default function CommentsPage() {
  const t = useTranslations();


  
  const cols = [
    { header: t("Time"), accessorKey: "time" },
    { header: t("Description"), accessorKey: "description" },
  ];

  const sampleData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    time: new Date().toLocaleDateString(),
    description: `Gói gia hạn Zoom Pro ${i + 1}`,
  }));

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

          <CommmonDataTable columns={cols} data={sampleData} />
        </div>
      </CardContent>
    </Card>
  );
}
