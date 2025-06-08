"use client";

import { ProductItemDetail } from "@/api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import KeyFileUploadDialog from "@/components/product/KeyFileUploadDialog";
import KeyInsertDialog from "@/components/product/KeyInsertDialog";
import ProductItemFilterSheet from "@/components/product/ProductItemFilterSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionToast } from "@/hooks/use-action-toast";
import { useProductItemStore } from "@/stores/product.item.store";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
export default function KeyManagementPage() {
  const t = useTranslations();

  const [getProductItems , queryParams , lastAction , error , status , productItems , deleteProductItems] = useProductItemStore(useShallow((state) => [
    state.getProductItems,
    state.queryParams,
    state.lastAction,
    state.error,
    state.status,
    state.productItems,
    state.deleteProductItems,
  ]));


  let pagination:PaginationState = {
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  };

  let sorting:SortingState = [
    {
      id: queryParams?.pageRequest?.sortBy ?? "createdAt",
      desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
  ];


  useActionToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });


  useEffect(() => {
    getProductItems({
      pageRequest: {
        page: 0,
        size: 10,
        sortBy: "createdAt",
        sortDirection: "desc",	
      },
    });
  }, [getProductItems]);

  const cols: ColumnDef<ProductItemDetail>[] = [
    {
      accessorKey: "ID",
      header: "ID",
      cell: ({ row }) => {
        return row.original.id;
      },
        enableHiding: false,
    },
    {
      accessorKey: "image",
      header: t("Image"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <div className="relative size-20 border border-border rounded-lg">
              <Image
                alt={row.original.id.toString()}
                src={row.original.imageUrl ?? "/empty_img.png"}
                fill
                sizes="100%"
                className="rounded-md object-cover"
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "productName",
      header: t('Product_name'),
      cell: ({ row }) => {
        return row.original.name;
      },
     
    },
    {
      accessorKey: "productKey",
      header: t("Product_key"),
      cell: ({ row }) => {
        return row.original.productKey;
      },
     
    },
    {
      accessorKey: "region",
      header: t("Region"),
      cell: ({ row }) => {
        return row.original.region;
      },
      
    },
    {
      accessorKey: "createdAt",
      header: t('created_at'),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString();
      },
     
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        return <StatusBadge status={row.original.used ? "used" : "unused"} />;
      },
     
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="capitalize">{t('product_key_management')}</h2>
          <div className="flex items-center gap-2">
            <KeyFileUploadDialog />
            <KeyInsertDialog />
            <ProductItemFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
         
          <CommmonDataTable
          objectName={t("product_key")}
          isLoading={productItems === null}
          columns={cols}
          data={productItems?.data ?? []}
          totalCount={productItems?.totalInstances ?? 0}
          pageCount={productItems?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            pagination = typeof updater === "function" ? updater(pagination) : updater;
            getProductItems({
              pageRequest: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sortBy: sorting[0]?.id,
                sortDirection: sorting[0]?.desc ? "desc" : "asc",
              },
            });
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteProductItems(rows);
          }}
          sorting={sorting}
          onSortingChange={(updater) => {
            sorting = typeof updater === "function" ? updater(sorting) : updater;
            getProductItems({
              pageRequest: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sortBy: sorting[0]?.id,
                sortDirection: sorting[0]?.desc ? "desc" : "asc",
              },
            });
          }}
        />
        
      </CardContent>
    </Card>
  );
}
