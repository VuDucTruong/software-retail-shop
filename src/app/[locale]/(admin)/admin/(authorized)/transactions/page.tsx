"use client";

import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/common/StatusBadge";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { Payment } from "@/models/payment";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function TransactionMangementPage() {
  const t = useTranslations();

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
          return <div className="font-bold">{row.original.user.email}</div>;
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
  ];

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
          data={sampleData}
          hasActions
          renderActions={(row) => {
            return (
              <TransactionDetailDialog payment={row} />
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
