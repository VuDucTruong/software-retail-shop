"use client";

import { Product } from "@/api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionToast } from "@/hooks/use-action-toast";
import { useRouter } from "@/i18n/navigation";
import { useProductStore } from "@/stores/product.store";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { useShallow } from "zustand/shallow";

export default function ProductManagementPage() {
  const t = useTranslations();
  const router = useRouter();

  const [
    getProducts,
    products,
    queryParams,
    lastAction,
    error,
    status,
    resetStatus,
    deleteProducts,
  ] = useProductStore(
    useShallow((state) => [
      state.getProducts,
      state.products,
      state.queryParams,
      state.lastAction,
      state.error,
      state.status,
      state.resetStatus,
      state.deleteProducts,
    ])
  );

  useEffect(() => {
    resetStatus();
  }, []);

  useActionToast({ lastAction, status, errorMessage: error || undefined });

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

  useEffect(() => {
    getProducts({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    });
  }, [sorting, pagination]);

  const cols: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
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
      accessorKey: "name",
      header: t("Name"),
      cell: ({ row }) => {
        return row.original.name;
      },
    },
    {
      accessorKey: "slug",
      header: t("product_code"),
      cell: ({ row }) => {
        return row.original.slug;
      },
    },
    {
      accessorKey: "tags",
      header: t("Tags"),
      cell: ({ row }) => {
        return row.original.tags?.join(", ");
      },
    },
    {
      accessorKey: "price",
      header: t("Price"),
      cell: ({ row }) => {
        return row.original.price;
      },
    },
    {
      accessorKey: "stock",
      header: t("Stock"),
      cell: ({ row }) => {
        return row.original.quantity;
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <StatusBadge
            status={row.original.quantity ?? 0 > 0 ? "in_stock" : "out_stock"}
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleViewDetails(row.original.id)}
          >
            <Eye />
          </Button>
        </div>;
      },
    },
  ];

  const handleViewDetails = (id: number) => {
    router.push(`products/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("product_management")}</h2>
          <div className="flex items-center gap-2">
            <Link href={"products/create"}>
              <Button variant="outline" className="bg-primary text-white">
                <CgAdd /> {t("create_product")}
              </Button>
            </Link>
            <ProductFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          objectName={t("product")}
          isLoading={products === null}
          columns={cols}
          data={products?.data ?? []}
          totalCount={products?.totalInstances ?? 0}
          pageCount={products?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteProducts(rows);
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
