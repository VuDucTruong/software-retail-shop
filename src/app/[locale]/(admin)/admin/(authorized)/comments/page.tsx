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
const sampleData: UserComment[] = [];
export default function CommentManagementPage() {
  const t = useTranslations();
  const [data, setData] = useState<UserComment[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  useEffect(() => {
    const fetchData = async () => {
      const sort = sorting[0];
      const sortBy = sort?.id || "id";
      const order = sort?.desc ? "desc" : "asc";
      console.log(
        "Fetching data with pagination:",
        pagination,
        "and sorting:",
        sortBy,
        order
      );
      setData(sampleData);
      setPageCount(100);
    };
    fetchData();
  }, [pagination, sorting]);

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
        return row.original.createdAt;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 w-fit">
            <EditCommentDialog />
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
          columns={cols}
          data={data}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            console.log(rows);
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
