"use client";

import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import { OrdersFilterForm } from "@/components/orders/OrdersFilterForm";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { convertPriceToVND } from "@/lib/currency_helper";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Category } from "@/models/category";
import { Order } from "@/models/order/order";
const scheme = z.object({
  time: z.string(),
  order_id: z.string(),
  product: z.string(),
  quantity: z.number(),
  total: z.number().transform((val) => convertPriceToVND(val)),
  status: z.string(),

});
const sampleData = Array.from({ length: 10 }, (_, i) => ({
  time: "2023-10-01 12:00:00",
  order_id: `ORD${i + 1}`,
  product: `Product ${i + 1}`,
  quantity: Math.floor(Math.random() * 10) + 1,
  total: Math.floor(Math.random() * 1000000) + 100000,
  status: "pending",
}));
export default function OrderPage() {
  const t = useTranslations();
const [data, setData] = useState<any[]>([]);
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


  const cols: ColumnDef<z.infer<typeof scheme>>[] = [
    { header: t("Time"), accessorKey: "time"},
    {
      header: t("order_id"),
      accessorKey: "order_id",
    },
    { header: t("Product"), accessorKey: "product"},
    {
      header: t("Quantity"),
      accessorKey: "quantity",
      cell: ({row}) => <div className="text-center">{row.original.quantity}</div>
    },
    { header: t("Total"), accessorKey: "total" },
    { header: t("Status"), accessorKey: "status",cell: (cell) => {
      const status = cell.getValue();
      return (
        <StatusBadge status="pending" />
      );
    },}
  ];

  return (
    <Card>
      <CardHeader>
        <h3>{t("order_history")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("order_history_description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="divider"></div>
          <OrdersFilterForm />

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
        </div>
      </CardContent>
    </Card>
  );
}
