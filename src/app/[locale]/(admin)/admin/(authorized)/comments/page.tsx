"use client";

import EditCommentDialog from "@/components/comments/EditCommentDialog";
import { CommmonDataTable } from "@/components/common/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/common/StatusBadge";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { Comment } from "@/models/comment";
import { Payment } from "@/models/payment";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CommentManagementPage() {
  const t = useTranslations();

  const cols: ColumnDef<Comment>[] = [
    {
        accessorKey: "Id",
        header: "ID",
        cell: ({ row }) => {
          return row.original.id;
        },
        enableHiding: false,
      },
      {
        accessorKey: "User",
        header: t("User"),
        cell: ({ row }) => {
          return <div className="font-bold">{row.original.username}</div>;
        },
      },
      {
        accessorKey: "product",
        header: t("Product"),
        cell: ({ row }) => {
          return <Link href={"/"}><Button variant={"link"}>{row.original.productName}</Button></Link>;
        },
      },
      {
        accessorKey: "comment",
        header: t("Comment"),
        cell: ({ row }) => {
          return row.original.content;
        },
      },
      {
        accessorKey: "time",
        header: t("Time"),
        cell: ({ row }) => {
          return row.original.date;
        },
      },
      
  ];

  const sampleData: Comment[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    username: `User ${i + 1}`,
    content: `This is a comment content for comment ${i + 1}`,
    date: `2023-10-${i + 1}`,
    productName: `Product ${i + 1}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("comment_management")}</h2>
          <div className="flex items-center gap-2">
            <ProductFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          columns={cols}
          data={sampleData}
          hasActions
          renderActions={(row) => {
            return (
              <div className="flex items-center gap-2 w-fit">
                <EditCommentDialog />
                <Link href={"/asdf"}><Button><ExternalLink/></Button></Link>
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
