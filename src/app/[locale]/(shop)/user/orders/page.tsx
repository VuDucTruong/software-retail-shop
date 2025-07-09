"use client";

import { convertStatus, StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { OrdersFilterForm } from "@/components/orders/OrdersFilterForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Order } from "@/api";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import { Button } from "@/components/ui/button";
import { ScanEye, Trash2 } from "lucide-react";
import { OrderMany } from "@/stores/order/order.store";
import { useShallow } from "zustand/shallow";
import Link from "next/link";
import { useActionToast } from "@/hooks/use-action-toast";
import { convertPriceToVND } from "@/lib/currency_helper";

const genCols = (
  t: ReturnType<typeof useTranslations>,
  handleDelete: (id: number) => void
): ColumnDef<Order>[] => {
  return [
    {
      accessorKey: "Id",
      header: "ID",
      cell: ({ row }) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "By",
      header: t("payment_method"),
      cell: ({ row }) => {
        return row.original.payment?.paymentMethod;
      },
    },
    {
      accessorKey: "Amount",
      header: t("Amount"),
      cell: ({ row }) => {
        return convertPriceToVND(row.original.amount ?? 0);
      },
    },
    {
      accessorKey: "Status",
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <StatusBadge
            status={convertStatus(row.original.orderStatus ?? "PENDING")}
          />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("Time"),
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString();
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <>
            <div className="flex justify-center items-center gap-2">
              <TransactionDetailDialog orderId={row.original.id} />
              <Link href={`/user/orders/${row.original.id}`}>
                <Button variant="outline" className="bg-white text-black ">
                  <ScanEye className="w-4 h-4" /> {t("Detail")}
                </Button>
              </Link>
              {row.original.deletedAt ? null : (
                <CommonConfirmDialog
                  triggerName={
                    <Button
                      variant={"destructive"}
                      size="icon"
                      className="w-8 h-8 "
                    >
                      <Trash2 />
                    </Button>
                  }
                  title={`${t("Delete")} ${t("Order")}`}
                  description={t("delete_order_warning")}
                  onConfirm={() => handleDelete(row.original.id)}
                />
              )}
            </div>
          </>
        );
      },
    },
  ];
};

export default function OrderPage() {
  const t = useTranslations();

  const [
    status,
    lastAction,
    error,
    orders,
    queryParams,
    totalInstances,
    totalPages,
    getOrders,
    deleteOrderById,
    proxyLoading,
  ] = OrderMany.useStore(
    useShallow((state) => [
      state.status,
      state.lastAction,
      state.error,
      state.orders,
      state.queryParams,
      state.totalInstances,
      state.totalPages,
      state.getOrders,
      state.deleteById,
      state.proxyLoading,
    ])
  );
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
  useEffect(() => {
    proxyLoading(() => {
      getOrders({
        pageRequest: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sortBy: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? "desc" : "asc",
        },
      });
    }, "get");
  }, []);

  function handleDelete(id: number) {
    deleteOrderById(id);
  }

  useActionToast({ lastAction, status, errorMessage: error || undefined });

  const cols = genCols(t, handleDelete);

  return (
    <Card>
      <CardHeader>
        <h3>{t("order_history")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("order_history_description")}
        </p>
        <CardTitle className="flex items-center justify-start">
          <OrdersFilterForm mode={"personal"} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          totalCount={totalInstances}
          isLoading={status === "loading" && orders.length <= 0}
          columns={cols}
          data={orders}
          pageCount={totalPages}
          pagination={pagination}
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
