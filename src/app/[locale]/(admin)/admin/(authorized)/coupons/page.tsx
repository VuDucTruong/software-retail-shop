"use client";

import {Coupon} from "@/api";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import CouponFilterSheet from "@/components/coupon/CouponFilterSheet";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useActionToast} from "@/hooks/use-action-toast";
import {useRouter} from "@/i18n/navigation";
import {convertPriceToVND} from "@/lib/currency_helper";
import {useCouponStore} from "@/stores/coupon.store";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {Eye} from "lucide-react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {useEffect, useState} from "react";
import {CgAdd} from "react-icons/cg";
import {useShallow} from "zustand/shallow";
import {SearchWithDropDown} from "@/components/ui/search/SearchWithDropDown";

export default function CouponManagementPage() {
  const t = useTranslations();
  const router = useRouter();

  const [queryParams, getCoupons, status, lastAction, error, coupons, deleteCouponns] = useCouponStore(
    useShallow((state) => [
      state.queryParams,
      state.getCoupons,
      state.status,
      state.lastAction,
      state.error,
      state.coupons,
      state.deleteCoupons,
    ])
  )

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
  }, [sorting, pagination, getCoupons]);

  const cols: ColumnDef<Coupon>[] = [
    {
      accessorKey: "code",
      header: t("Code"),
      cell: ({row}) => {
        return <div className="font-bold">{row.original.code}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "availableFrom",
      header: t("available_from"),
      cell: ({row}) => {
        return new Date(row.original.availableFrom!).toLocaleDateString();
      },
    },
    {
      accessorKey: "availableTo",
      header: t("available_to"),
      cell: ({row}) => {
        return new Date(row.original.availableTo!).toLocaleDateString();
      },
    },
    {
      accessorKey: "value",
      header: t("Value"),
      cell: ({row}) => {
        return <div className="flex flex-col gap-1">
          {
            row.original.type === "PERCENTAGE" ?
              <div>{row.original.value} %</div> :
              <div>{convertPriceToVND(row.original.value)}</div>
          }
          <div
            className="text-muted-foreground">{t("for_min_order_value_x", {x: convertPriceToVND(row.original.minAmount ?? 0)})}</div>
          <div
            className="text-muted-foreground">{t("max_reduction_x", {x: convertPriceToVND(row.original.maxAppliedAmount ?? 0)})}</div>
        </div>;
      },
    },
    {
      accessorKey: "usageLimit",
      header: t("usage_limit"),
      cell: ({row}) => {
        return row.original.usageLimit;
      },
    },
    {
      accessorKey: "description",
      header: t("Description"),
      cell: ({row}) => {
        return row.original.description;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({row}) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleViewDetails(row.original.id)}
            >
              <Eye/>
            </Button>
          </div>
        );
      },
    }
  ];

  const handleViewDetails = (id: number) => {
    router.push(`coupons/${id}`);
  };

  function onSearchAndTypeDebounced(couponType: (number | string)[], search: string) {

    const cleanedCouponType = (!Array.isArray(couponType) && couponType === 'all') ? undefined : couponType
    getCoupons({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
      search: search,
      type: cleanedCouponType
    });
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("coupon_management")}</h2>
          <div className="flex items-center gap-2">
            <Link href={"coupons/create"}>
              <Button variant="outline" className="bg-primary text-white">
                <CgAdd/> {t("create_coupon")}
              </Button>
            </Link>
            <CouponFilterSheet/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          searchComponent={<SearchWithDropDown
            menus={{
              items: [{id: "all", name: t('All'),}, {id: "FIXED", name: t('Fixed'),}, {id: "PERCENTAGE", name: t('Percentage'),}],
              multiple: false
            }}
            search={{}}
            onDebounced={onSearchAndTypeDebounced}
          />}

          objectName={t("coupon")}
          isLoading={coupons === null}
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
            deleteCouponns(rows);
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
