"use client";

import { CommentsFilterForm } from "@/components/comments/CommentsFilterForm";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

export default function CommentsPage() {
  const t = useTranslations();

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

          {/* <CommmonDataTable  /> */}
        </div>
      </CardContent>
    </Card>
  );
}
