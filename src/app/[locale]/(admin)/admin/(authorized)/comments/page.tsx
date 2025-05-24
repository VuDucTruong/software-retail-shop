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
export default function CommentManagementPage() {
  const t = useTranslations();
  
  const [
      status,
      lastAction,
      error,
      getComments,
      resetStatus,
      queryParams,
      comments
    ] = useCommentStore(
      useShallow((state) => [
        state.status,
        state.lastAction,
        state.error,
        state.getComments,
        state.resetStatus,
        state.queryParams,
        state.comments,
      ])
    );
  
    useEffect(() => {
      resetStatus();
    },[]); 
  
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
      cell: ({ row }) => {
        return <div className="font-bold">{row.original.author.fullName}</div>;
      },
    },
    {
      accessorKey: "product",
      header: t("Product"),
      cell: ({ row }) => {
        return (
          <Link href={"/"}>
            <Button variant={"link"}>{"Not impletemed"}</Button>
          </Link>
        );
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
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 w-fit">
            <EditCommentDialog comment={row.original}/>
            <Link href={"/asdf"}>
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
          objectName={t("comment")}
          isLoading={status === "loading" && lastAction === null}
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
