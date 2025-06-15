"use client";

import { User } from "@/api";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminFilterSheet from "@/components/user/AdminFilterSheet";
import UserDetailDialog from "@/components/user/UserDetailDialog";
import { useUserToast } from "@/hooks/use-user-toast";

import { useUserStore } from "@/stores/user.store";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { UserX2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function StaffManagementPage() {
  const t = useTranslations();

  const [status, lastAction, error, queryParams, users, getUsers, deleteUsers] =
    useUserStore(
      useShallow((state) => [
        state.status,
        state.lastAction,
        state.error,
        state.queryParams,
        state.users,
        state.getUsers,
        state.deleteUsers,
      ])
    );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  });


  useUserToast({
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
    getUsers({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    });
  }, [sorting, pagination, getUsers]);

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
      accessorKey: "fullName",
      header: ({ column }) => (
        <SortingHeader column={column} title={t("Name")} />
      ),
      cell: ({ row }) => {
        return <div className="font-bold">{row.original.profile.fullName}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return row.original.email;
      },
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: t("Role"),
      cell: ({ row }) => {
        return row.original.role;
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <StatusBadge status={row.original.deletedAt ? "banned" : "active"} />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("created_at"),
      cell: ({ row }) => {
        return row.original.createdAt;
      },
    },
    {
          accessorKey: "actions",
          header: "",
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                <UserDetailDialog user={row.original} />
    
                {row.original.deletedAt ? null : (
                  <CommonConfirmDialog
                    triggerName={
                      <Button
                        variant={"destructive"}
                        size="icon"
                        className="w-8 h-8"
                      >
                        <UserX2 />
                      </Button>
                    }
                    title={t("ban_user")}
                    description={
                      t("ban_user_description", {
                        user: row.original.profile.fullName,
                      })
                    }
                    onConfirm={() => handleDelete(row.original.id)}
                  />
                )}
              </div>
            );
          },
        },
  ];

  const handleDelete = (id: number) => {
    deleteUsers([id]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("admin_management")}</h2>
          <div className="flex items-center gap-2">
            <Link href={"/admin/staffs/create"}>
                <Button>
                    {t('create_admin')}
                </Button>
            </Link>
            <AdminFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
            objectName={t("admin")}
          isLoading={status === "loading" && lastAction === "getUsers"}
          columns={cols}
          data={users?.data ?? []}
          totalCount={users?.totalInstances ?? 0}
          pageCount={users?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteUsers(rows);
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
