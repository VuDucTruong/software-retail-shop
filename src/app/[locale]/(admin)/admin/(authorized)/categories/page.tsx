"use client";

import { Category } from "@/api";
import CategoryFilterSheet from "@/components/category/CategoryFilterSheet";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import EditCategoryDialog from "@/components/category/EditCategoryDialog";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionToast } from "@/hooks/use-action-toast";
import { useCategoryStore } from "@/stores/category.store";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
export default function CategoryManagementPage() {
  const t = useTranslations();

  

  const [
    status,
    lastAction,
    error,
    categories,
    getCategories,
    queryParams,
    deleteCategories,
  ] = useCategoryStore(
    useShallow((state) => [
      state.status,
      state.lastAction,
      state.error,
      state.categories,
      state.getCategories,
      state.queryParams,
      state.deleteCategories,
    ])
  );

  useEffect(() => {
    useCategoryStore.getState().resetStatus();
  },[]); 

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
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
    getCategories({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    });
  }, [sorting, pagination, getCategories]);

  const cols: ColumnDef<Category>[] = [
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
      header: ({ column }) => (
        <SortingHeader column={column} title={t("Name")} />
      ),
      cell: ({ row }) => {
        return <div className="font-bold">{row.original.name}</div>;
      },
      enableHiding: false,
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
          <div className="flex items-center gap-2">
            <EditCategoryDialog selectedCategory={row.original} />

            <CommonConfirmDialog
              triggerName={
                <Button variant={"destructive"} size="icon" className="w-8 h-8">
                  <Trash2Icon />
                </Button>
              }
              title={t("delete_category")}
              description={t("delete_category_description")}
              onConfirm={() => handleDelete(row.original.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleDelete = (id: number) => {
    deleteCategories([id]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("category_management")}</h2>
          <div className="flex items-center gap-2">
            <CreateCategoryDialog />
            <CategoryFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        
          <CommmonDataTable
          objectName={t("category")}
          isLoading={categories === null}
          columns={cols}
          data={categories?.data ?? []}
          totalCount={categories?.totalInstances ?? 0}
          pageCount={categories?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteCategories(rows);
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
