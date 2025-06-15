"use client";

import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import {StatusBadge} from "@/components/common/StatusBadge";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Payment} from "@/api";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {UserX2, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";

const sampleData: Payment[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  status: "SUCCESS",
  orderId: 20230423,
  createAt: "2025-04-23T14:30:00Z",
  deletedAt: null,
  user: {
    id: 1,
    fullName: "Alice Nguyen",
    email: "alice.nguyen@example.com",
    imageUrl: "https://example.com/avatar/alice.jpg",
    createdAt: "2023-09-01T08:00:00Z"
  },
  paymentMethod: "VISA",
  amount: 150.75,
  currency: "USD",
  bankCode: "VCBPAY",
  orderInfo: "Payment for Order #20230423",
  cardInfo: "**** **** **** 1234"
}));

export default function TransactionMangementPage() {
  const t = useTranslations();
const [data, setData] = useState<Payment[]>([]);
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
  function handleDelete(id){
    console.log("deleting",id)
  }
  const cols: ColumnDef<Payment>[] = [
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
          return <div className="font-bold">{"Email"}</div>;
        },
      },
      {
        accessorKey: "By",
        header: t("payment_method"),
        cell: ({ row }) => {
          return row.original.paymentMethod;
        },
      },
      {
        accessorKey: "Amount",
        header: t("Amount"),
        cell: ({ row }) => {
          return row.original.amount;
        },
      },
      {
        accessorKey: "Status",
        header: t("Status"),
        cell: ({ row }) => {
          return <StatusBadge status={"completed"} />;
        },
      },
      {
        accessorKey: "createAt",
        header: t("Time"),
        cell: ({ row }) => {
          return row.original.createAt;
        },
      },
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => {
          return (
            <>
              <div className="flex items-end gap-2">
                <TransactionDetailDialog payment={row.original} />

                {row.original.deletedAt ? null : (
                    <CommonConfirmDialog
                        triggerName={
                          <Button
                              variant={"destructive"}
                              size="icon"
                              className="w-8 h-8"
                          >
                            <Trash2 />
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
