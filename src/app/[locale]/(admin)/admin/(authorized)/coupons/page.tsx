"use client";

import { Coupon } from "@/api";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import TableOptionMenu from "@/components/common/TableOptionMenu";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";
const sampleData: Coupon[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  code: `Coupon ${i + 1}`,
  type: i % 2 === 0 ? "PERCENTAGE" : "FIXED",
  availableFrom: new Date().toISOString(),
  availableTo: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 100),
  minAmount: Math.floor(Math.random() * 100),
  maxAppliedAmount: Math.floor(Math.random() * 100),
  usageLimit: Math.floor(Math.random() * 100),
  description: `Description for Coupon ${i + 1}`,
}));
export default function CouponManagementPage() {
  const t = useTranslations();
  const router = useRouter();

const [data, setData] = useState<Coupon[]>([]);
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


  const cols: ColumnDef<Coupon>[] = [
    {
      accessorKey: "code",
      header: t("Code"),
      cell: ({ row }) => {
        return <div className="font-bold">{row.original.code}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "availableFrom",
      header: t("Available From"),
      cell: ({ row }) => {
        return new Date(row.original.availableFrom!).toLocaleDateString();
      },
    },
    {
      accessorKey: "availableTo",
      header: t("Available To"),
      cell: ({ row }) => {
        return new Date(row.original.availableTo!).toLocaleDateString();
      },
    },
    {
      accessorKey: "value",
      header: t("Value"),
      cell: ({ row }) => {
        return <div className="flex flex-col gap-1">
          <div>{row.original.value} {row.original.type === "PERCENTAGE" ? <span>%</span> : ""}</div>
          <div className="text-muted-foreground">{t("for_min_order_value_x", {x: row.original.minAmount ?? 0})}</div>
          <div className="text-muted-foreground">{t("max_reduction_x", {x: row.original.maxAppliedAmount ?? 0})}</div>
        </div>;
      },
    },
    {
      accessorKey: "usageLimit",
      header: t("Usage Limit"),
      cell: ({ row }) => {
        return row.original.usageLimit;
      },
    },
    {
      accessorKey: "description",
      header: t("Description"),
      cell: ({ row }) => {
        return row.original.description;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <TableOptionMenu actions={[
            {
              label: t("Detail"),
              onClick: () => handleViewDetails(row.original.id!),
            },
            {
              label: t("Delete"),
              onClick: () => handleDelete(row.original.id!),
              confirm: {
                title: t("delete_coupon_x", { x: row.original.id! }),
                description: t("delete_coupon_warning"),
              },
            },
           ]}/>
        );
      },
    }
  ];



  const handleDelete = (id: number) => {
    toast.success(t("Success", { x: id }));
  };

  const handleViewDetails = (id: number) => {
    router.push(`coupons/${id}`);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("coupon_management")}</h2>
          <div className="flex items-center gap-2">
          <Link href={"coupons/create"}>
              <Button variant="outline" className="bg-primary text-white">
                <CgAdd /> {t("create_coupon")}
              </Button>
            </Link>
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
