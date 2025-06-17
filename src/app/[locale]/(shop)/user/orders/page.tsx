"use client";

import {convertStatus, StatusBadge} from "@/components/common/StatusBadge";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import {OrdersFilterForm} from "@/components/orders/OrdersFilterForm";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {Order} from "@/api";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {getDateTimeLocal} from "@/lib/date_helper";
import {OrderMany} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";


const genCols = (t: ReturnType<typeof useTranslations>, handleDelete: (id: number) => void): ColumnDef<Order>[] => {

    return [
        {
            accessorKey: "Id",
            header: "ID",
            cell: ({row}) => {
                return row.original.id;
            },
            enableHiding: false,
        },
        {
            accessorKey: "By",
            header: t("payment_method"),
            cell: ({row}) => {
                return row.original.payment?.paymentMethod;
            },
        },
        {
            accessorKey: "Amount",
            header: t("Amount"),
            cell: ({row}) => {
                return row.original.amount + ' VND';
            },
        },
        {
            accessorKey: "Status",
            header: t("Status"),
            cell: ({row}) => {
                return <StatusBadge status={convertStatus(row.original.orderStatus ?? 'PENDING')}/>;
            },
        },
        {
            accessorKey: "createdAt",
            header: t("Time"),
            cell: ({row}) => {
                return getDateTimeLocal(row.original.createdAt);
            },
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({row}) => {
                return (
                    <>
                        <div className="flex justify-center items-end gap-2">
                            <TransactionDetailDialog order={row.original}/>
                            {row.original.deletedAt ? null : (
                                <CommonConfirmDialog
                                    triggerName={
                                        <Button
                                            variant={"destructive"}
                                            size="icon"
                                            className="w-8 h-8"
                                        >
                                            <Trash2/>
                                        </Button>
                                    }
                                    title={"Cấm người dùng"}
                                    description={
                                        "Bạn có chắc chắn muốn xóa đơn hàng này không?"
                                    }
                                    onConfirm={() => handleDelete(row.original.id)}
                                />
                            )}
                        </div>

                    </>
                );
            },
        }
    ];
}


export default function OrderPage() {
    const t = useTranslations();

    const [status, lastAction, error, orders, queryParams, totalInstances, totalPages, getOrders, deleteOrders, deleteOrderById] =
        OrderMany.useStore(
            useShallow((state) => [
                state.status,
                state.lastAction,
                state.error,
                state.orders,
                state.queryParams,
                state.totalInstances,
                state.totalPages,
                state.getOrders,
                state.deleteOrders,
                state.deleteById,
            ])
        );
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: queryParams?.pageRequest?.page ?? 0,
        pageSize: queryParams?.pageRequest?.size ?? 10,
    });
    const [sorting, setSorting] = useState<SortingState>([{
        id: queryParams?.pageRequest?.sortBy ?? "createdAt",
        desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
    ]);
    useEffect(() => {
        getOrders({
            pageRequest: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sortBy: sorting[0]?.id,
                sortDirection: sorting[0]?.desc ? "desc" : "asc",
            },
        });
    }, []);

    function handleDelete(id: number){

    }

    const cols = genCols(t, handleDelete)

    return (
        <Card>
            <CardHeader>
                <h3>{t("order_history")}</h3>
                <p className="font-normal italic text-muted-foreground">
                    {t("order_history_description")}
                </p>
              <CardTitle className="flex items-center justify-between">
                <OrdersFilterForm mode={'personal'}/>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col ">
                    <div className="divider"></div>


                    <CommmonDataTable
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
                </div>
            </CardContent>
        </Card>
    );
}
