"use client";

import CommonConfirmDialog from "@/components/CommonConfirmDialog";
import { CommmonDataTable } from "@/components/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { Category } from "@/types/api/category";
import { Product } from "@/types/api/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";

export default function CategoryManagementPage() {
  const t = useTranslations();
  const router = useRouter();
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
        return <div className="flex items-center justify-center">
          <div className="relative size-20 ">
          <Image alt={row.original.id.toString()} src={row.original.imageUrl} fill className="rounded-md object-cover" />
        </div>
        </div>;
      },

    },
    {
      accessorKey: "name",
      header: t("Name"),
      cell: ({ row }) => {
        return row.original.name;
      },
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: t("Description"),
      cell: ({ row }) => {
        return row.original.name;
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
    toast.success(t("Success", { x:id }));
    
  };

  const handleViewDetails = (id: number) => {
    
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("category_management")}</h2>
          <div className="flex items-center gap-2">
            <Link href={"products/create"}>
              <Button variant="outline" className="bg-primary text-white">
                <CgAdd /> {t("create_category")}
              </Button>
            </Link>
            <ProductFilterSheet />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          columns={cols}
          data={sampleData}
          hasActions
          renderActions={(row) => {
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex size-8" size="icon">
                    <MoreVerticalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={()=>handleViewDetails(row.id)}>{t("Detail")}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                      <CommonConfirmDialog
                        onConfirm={() => {
                          handleDelete(row.id);
                        }}
                        triggerName={t("Delete")}
                        title={t("delete_product_#x", { x: row.id })}
                        description={t("delete_product_warning")}
                      />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
