"use client";

import { UserComment } from "@/api";
import { CommentsFilterForm } from "@/components/comments/CommentsFilterForm";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useClientCommentStore } from "@/stores/cilent/client.comment.store";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Delete } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function CommentsPage() {
  const t = useTranslations();
  const [getComments , comments, queryParams , status , lastAction , error , deleteMyCommentList] = useClientCommentStore(useShallow((state) => [
    state.getCommentsByProductId,
    state.comments,
    state.queryParams,
    state.status,
    state.lastAction,
    state.error,
    state.deleteMyCommentList,
  ]));

    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: queryParams?.pageRequest?.page ?? 0,
      pageSize: queryParams?.pageRequest?.size ?? 10,
    });
  
  
    const [sorting, setSorting] = useState<SortingState>([
      {
        id: queryParams?.pageRequest?.sortBy ?? "createdAt",
        desc: queryParams?.pageRequest?.sortDirection === "desc",
      },
    ]);
  

  const cols: ColumnDef<UserComment>[] = [
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
                <SortingHeader column={column} title={t("create_date")} />
              ),
        cell: ({ row }) => {
          return row.original.createdAt;
        },
      },
      {
        accessorKey: "content",
        header: t("Content"),
        cell: ({ row }) => {
          return row.original.content;
        },
      },
      {
        accessorKey: "product",
        header: t("Product"),
        cell: ({ row }) => {
          if(row.original.product) {
            return <Link href={"/product/"+ row.original.product.slug} target="_blank" rel="noopener noreferrer">
              <Button variant="link" className="text-left">
                {row.original.product.name}
              </Button>
            </Link>
          }
          return <div className="text-red-500">{t("product_not_found")}</div>;
        },
      }
    ];


  useEffect(() => {
    getComments();
  }
  , [getComments]);

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

          <CommmonDataTable
          objectName={t("comment")}
          isLoading={comments === null}
          columns={cols}
          data={comments?.data ?? []}
          totalCount={comments?.totalInstances ?? 0}
          pageCount={comments?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteMyCommentList(rows);
          }}
          sorting={sorting}
          onSortingChange={(updater) => {
            setSorting((prev) =>
              typeof updater === "function" ? updater(prev) : updater
            );
          }}
        />
        </div>
      </CardContent>
    </Card>
  );
}
