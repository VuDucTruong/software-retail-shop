"use client";

import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import EditCategoryDialog from "@/components/category/EditCategoryDialog";
import { CommmonDataTable } from "@/components/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, CategoryCreate } from "@/models/category";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";

export default function CategoryManagementPage() {
  const t = useTranslations();
  const cols: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return row.id;
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
      header: t("Name"),
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
  ];

  const sampleData: Category[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Category ${i + 1}`,
    imageUrl: "/empty_img.png",
    description: `Description for Category ${i + 1}`,
  }));

  const handleDelete = (id: number) => {
    toast.success(t("Success", { x: id }));
  };

  const onCreate = (data: CategoryCreate) => {

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("category_management")}</h2>
          <div className="flex items-center gap-2">
            <CreateCategoryDialog onCreate={onCreate}/>
            <ProductFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          columns={cols}
          data={sampleData}
          hasActions
          renderActions={(row) => (
            <div className="flex items-center gap-2">
               <EditCategoryDialog/>
              <Button variant={"destructive"} onClick={()=>handleDelete(row.id)} size="icon" className="w-8 h-8">
              <Trash2Icon />
            </Button>
             
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
