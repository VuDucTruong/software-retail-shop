"use client";

import {Order, Payment} from "@/api";
import {StatusBadge} from "@/components/common/StatusBadge";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";

const sampleData: Order[] = [
    {
        id: 0,
        orderStatus: 'PENDING',
        profile: {
          id:0,
          fullName: 'laksdjlkjasd',
          createdAt: new Date().toISOString(),
          imageUrl: "/empty_user.png"
        },
        coupon: {
            id: 1,
            code: 'AJSDKLJLAS',
            value: 10,
            usageLimit: 100,
            type: 'PERCENTAGE',
            maxAppliedAmount: 100_000,
            availableFrom: new Date().toISOString(),
            availableTo: new Date().toISOString(),
            description: 'lakkdjsflakj',
            minAmount: 100
        },
        createdAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        details: [],
        payment: {
            id: 0,
            status: 'PENDING',
            cardType: 'ATM',
            detailMessage: 'asldl',
            detailCode: '10',
            paymentMethod: 'VISA',
            note: 'ALKSDJLKAJSD',
            orderId: 0,
            profileId: 1,
        },
        totalValue: 100_000
    }
];
export default function TransactionMangementPage() {
    const t = useTranslations();
    const [data, setData] = useState<Order[]>([]);
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

    function handleDelete(id: number) {
        console.log("deleting", id)
    }

    const cols: ColumnDef<Order>[] = [
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
            cell: ({}) => {
                return <div className="font-bold">{"Email"}</div>;
            },
        },
        {
            accessorKey: "By",
            header: t("payment_method"),
            cell: ({row}) => {
                return row.original.payment.paymentMethod;
            },
        },
        {
            accessorKey: "Amount",
            header: t("Amount"),
            cell: ({row}) => {
                return row.original.totalValue + ' VND';
            },
        },
        {
            accessorKey: "Status",
            header: t("Status"),
            cell: ({}) => {
                return <StatusBadge status={"completed"}/>;
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
                    <>
                        <div className="flex items-end gap-2">
                            <TransactionDetailDialog payment={row.original.payment}/>

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


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <h2>{t("transaction_management")}</h2>
                    <div className="flex items-center gap-2">
                        <ProductFilterSheet/>
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
