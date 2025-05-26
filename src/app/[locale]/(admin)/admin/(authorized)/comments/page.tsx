"use client";

import EditCommentDialog from "@/components/comments/EditCommentDialog";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/common/StatusBadge";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { UserComment, Payment } from "@/api";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCommentStore } from "@/stores/comment.store";
import { useShallow } from "zustand/shallow";
import { useActionToast } from "@/hooks/use-action-toast";
import { useCommentDialogStore } from "@/stores/dialog.store";
import CommentFilterSheet from "@/components/comments/CommentFilterSheet";
export default function CommentManagementPage() {
  const t = useTranslations();

  const [
    status,
    lastAction,
    error,
    getComments,
    resetStatus,
    queryParams,
    comments,
    deleteManyComments,
  ] = useCommentStore(
    useShallow((state) => [
      state.status,
      state.lastAction,
      state.error,
      state.getComments,
      state.resetStatus,
      state.queryParams,
      state.comments,
      state.deleteManyComments,
    ])
  );

  const openDialog = useCommentDialogStore(
    (state) => state.openDialog
  );

  useEffect(() => {
    resetStatus();
  }, []);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  });

  useActionToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: queryParams?.pageRequest?.sortBy ?? "createdAt",
      desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
  ]);

  useEffect(() => {
    getComments({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    });
  }, [sorting, pagination]);

  const cols: ColumnDef<UserComment>[] = [
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
      cell: ({ row }) => row.original.author.fullName,
    },
    {
      accessorKey: "product",
      header: t("Product"),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/products/${row.original.product?.id}`}>
            <Button variant={"link"}>{row.original.product?.name}</Button>
          </Link>
        );
      },
    },
    {
      accessorKey: "comment",
      header: t("Comment"),
      cell: ({ row }) => {

        if (row.original.deletedAt) {
          return (
            <div className="text-red-500">
              {row.original.content} <br />
              <span className="text-xs">Bị xóa vào {row.original.deletedAt}</span>
            </div>
          );
        }

        return row.original.content;
      },
    },
    {
      accessorKey: "createdAt",
      header: t("Time"),
      cell: ({ row }) => {
        return row.original.createdAt;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 w-fit">
            <Button
              variant="outline"
              className="hover:text-yellow-500 hover:border-yellow-500"
              onClick={() => {
                openDialog(row.original);
              }}
            >
              <Eye />
            </Button>
            <Link
              href={`/product/${row.original.product?.slug}`}
              target="_blank"
            >
              <Button>
                <ExternalLink />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <EditCommentDialog />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("comment_management")}</h2>
          <div className="flex items-center gap-2">
            <CommentFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          objectName={t("comment")}
          isLoading={status === "loading" && lastAction === null}
          columns={cols}
          data={comments?.data ?? []}
          totalCount={comments?.totalInstances ?? 0}
          pageCount={comments?.totalPages ?? 0}
          pagination={pagination}
          canSelect
          onDeleteRows={(selectedRows) => {
            deleteManyComments(selectedRows);
          }}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          sorting={sorting}
          onSortingChange={(updater) => {
            setSorting((prev) =>
              typeof updater === "function" ? updater(prev) : updater
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
