"use client";

import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserDetailDialog from "@/components/user/UserDetailDialog";
import { User } from "@/api/user/user";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CustomerManagementPage() {
  const t = useTranslations();
  const [data, setData] = useState<User[]>([]);
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
      setData([]);
      setPageCount(100);
    };
    fetchData();
  }, [pagination, sorting]);
  const cols: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="w-full flex items-center justify-center">
            <Avatar className="size-16 border border-border">
              <AvatarImage
                className="object-cover"
                src={row.original.profile.imageUrl}
                alt={row.original.profile.fullName}
              />
              <AvatarFallback className="bg-gray-400">
                {row.original.profile.fullName.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return row.original.profile.email;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return row.original.profile.fullName;
      },
    },

    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt!);

        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusBadge status={row.original.deletedAt ? "banned" : "active"} />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
                <UserDetailDialog user={row.original} />

                <CommonConfirmDialog
                  triggerName={
                    <Button variant="destructive" size="icon">
                      <UserX className="h-4 w-4" />
                    </Button>
                  }
                  title={t("ban_user_x", { x: row.original.id })}
                  description={t("ban_user_warning")}
                  onConfirm={() => handleBanUser(row.original.id)}
                />
              </div>
        );
      },
    }
  ];

  const handleBanUser = (userId: number) => {
    toast.success(t("ban_user_x_success", { x: userId }));

    //toast.error(t("ban_user_error"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("transaction_management")}</h2>
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
