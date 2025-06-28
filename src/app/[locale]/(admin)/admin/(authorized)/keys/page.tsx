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
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import {SearchWithDropDown} from "@/components/blog/search/SearchWithDropDown";
import {StringUtils} from "@/lib/utils";
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


  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: queryParams?.pageRequest?.sortBy ?? "createdAt",
      desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
  ]);


  useActionToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });


  useEffect(() => {
    getProductItems({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    });
  }, [pagination, sorting ,getProductItems]);

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
  function onSearchAndSearchByDebounced(searchBy: (number | string)[], search: string) {
    if (Array.isArray(searchBy) || !StringUtils.hasLength(searchBy))
      return
    getProductItems({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
      [searchBy]: search
    });
  }

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
            searchComponent={<SearchWithDropDown
              menus={{
                items: [{id: "productName", name: "Product name"}, {id: "productKey", name: "product Key"}],
                selectedId: "productName",
                multiple: false
              }}
              search={{}}
              onDebounced={onSearchAndSearchByDebounced}
            />}
          objectName={t("product_key")}
          isLoading={productItems === null}
          columns={cols}
          data={productItems?.data ?? []}
          totalCount={productItems?.totalInstances ?? 0}
          pageCount={productItems?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteProductItems(rows);
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
