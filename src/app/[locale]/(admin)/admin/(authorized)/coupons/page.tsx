"use client";

import { Coupon } from "@/api";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import TableOptionMenu from "@/components/common/TableOptionMenu";
import CouponFilterSheet from "@/components/coupon/CouponFilterSheet";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionToast } from "@/hooks/use-action-toast";
import { useRouter } from "@/i18n/navigation";
import { useCouponStore } from "@/stores/coupon.store";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function CouponManagementPage() {
  const t = useTranslations();
  const router = useRouter();

  const [queryParams , getCoupons , resetStatus , status , lastAction , error , coupons, deleteCoupon , deleteCouponns] = useCouponStore(
    useShallow((state) => [
      state.queryParams,
      state.getCoupons,
      state.resetStatus,
      state.status,
      state.lastAction,
      state.error,
      state.coupons,
      state.deleteCoupon,
      state.deleteCoupons,
    ])
  )

  useEffect(() => {
    resetStatus();
  },[])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 0,
  });
  
  useActionToast({
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
      getCoupons({
        pageRequest: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sortBy: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? "desc" : "asc",
        },
      });
    }, [sorting, pagination]);

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
          <div className="text-muted-foreground">{t("max_reduction_x", {x: row.original.maxAppliedAmount ?? "∞"})}</div>
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
    deleteCoupon(id)
  };

  const handleViewDetails = (id: number) => {
    router.push(`coupons/${id}`);
  };

  const deleteCoupons = (ids : number[]) => {
    deleteCouponns(ids)
  }


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
            <CouponFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
      <CommmonDataTable
          objectName={"Mã giảm giá"}
          isLoading={status === "loading" && lastAction === null}
          columns={cols}
          data={coupons?.data ?? []}
          totalCount={coupons?.totalInstances ?? 0}
          pageCount={coupons?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteCoupons(rows);
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
