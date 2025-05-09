"use client";

import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import EditCategoryDialog from "@/components/category/EditCategoryDialog";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, CategoryCreate } from "@/api";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const sampleData: Category[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1 + 1000,
  name: `Category ${i + 1}`,
  imageUrl: "/empty_img.png",
  description: `Description for Category ${i + 1}`,
}));
export default function CategoryManagementPage() {
  const t = useTranslations();

  const [data, setData] = useState<Category[]>([]);
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
                src={row.original.imageUrl}
                fill
                className="rounded-md object-cover"
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortingHeader column={column} title={t("Name")} />,
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
            <EditCategoryDialog />
            <Button
              variant={"destructive"}
              onClick={() => handleDelete(row.original.id)}
              size="icon"
              className="w-8 h-8"
            >
              <Trash2Icon />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDelete = (id: number) => {
    toast.success(t("Success", { x: id }));
  };

  const onCreate = (data: CategoryCreate) => {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("category_management")}</h2>
          <div className="flex items-center gap-2">
            <CreateCategoryDialog onCreate={onCreate} />
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
