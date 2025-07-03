"use client";

import {UserComment} from "@/api";
import CommentFilterSheet from "@/components/comments/CommentFilterSheet";
import EditCommentDialog from "@/components/comments/EditCommentDialog";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useActionToast} from "@/hooks/use-action-toast";
import {useCommentStore} from "@/stores/comment.store";
import {useCommentDialogStore} from "@/stores/dialog.store";
import {ColumnDef, PaginationState, SortingState,} from "@tanstack/react-table";
import {ExternalLink, Eye} from "lucide-react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useShallow} from "zustand/shallow";
import {SearchAlone} from "@/components/blog/search/SearchAlone";
import CommonToolTip from "@/components/common/CommonTooltip";

export default function CommentManagementPage() {
  const t = useTranslations();

  const [
    status,
    lastAction,
    error,
    getComments,
    queryParams,
    comments,
    deleteManyComments,
  ] = useCommentStore(
    useShallow((state) => [
      state.status,
      state.lastAction,
      state.error,
      state.getComments,
      state.queryParams,
      state.comments,
      state.deleteManyComments,
    ])
  );

  const openDialog = useCommentDialogStore(
    (state) => state.openDialog
  );

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
  }, [sorting, pagination, getComments]);

  const cols: ColumnDef<UserComment>[] = [
    {
      accessorKey: "Id",
      header: "ID",
      cell: ({row}) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "User",
      header: t("User"),
      cell: ({row}) => row.original.author.fullName,
    },
    {
      accessorKey: "product",
      header: t("Product"),
      cell: ({row}) => {
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
      cell: ({row}) => {

        if (row.original.deletedAt) {
          return (
            <div className="text-red-500">
              {row.original.content} <br/>
              <span className="text-xs">{t('deleted_at_x', {x: row.original.deletedAt})}</span>
            </div>
          );
        }

        return row.original.content;
      },
    },
    {
      accessorKey: "createdAt",
      header: t("Time"),
      cell: ({row}) => {
        return row.original.createdAt;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({row}) => {
        return (
          <div className="flex items-center gap-2 w-fit">
            <CommonToolTip content={t("view_details")}>
              <Button
              variant="outline"
              className="hover:text-yellow-500 hover:border-yellow-500"
              onClick={() => {
                openDialog(row.original);
              }}
            >
              <Eye/>
            </Button>
            </CommonToolTip>
            <Link
              href={`/product/${row.original.product?.slug}`}
              target="_blank"
            >
              <CommonToolTip content={t('view_on_ecommerce_site')}>
                <Button>
                <ExternalLink/>
              </Button>
              </CommonToolTip>
            </Link>
          </div>
        );
      },
    },
  ];

  function onSearchDebounced(search: string) {

    getComments({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
      search: search
    });
  }

  return (
    <Card>
      <EditCommentDialog/>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("comment_management")}</h2>
          <div className="flex items-center gap-2">
            <CommentFilterSheet/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          searchComponent={<SearchAlone onDebounced={onSearchDebounced}/>}

          objectName={t("comment")}
          isLoading={comments === null}
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
