"use client";

import { Payment } from "@/api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
const sampleData: Payment[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  status: "SUCCESS",
  orderId: 20230423,
  createAt: "2025-04-23T14:30:00Z",
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
  bankCode: "VCB",
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
        cell: ({ }) => {
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
        cell: ({  }) => {
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
            <TransactionDetailDialog payment={row.original} />
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
