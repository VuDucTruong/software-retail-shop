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
import { Product } from "@/types/api/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";

export default function ProductManagementPage() {
  const t = useTranslations();
  const router = useRouter();
  const cols: ColumnDef<Product>[] = [
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
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("Name"),
      cell: ({ row }) => {
        return row.original.name;
      },
    },
    {
      accessorKey: "model",
      header: t("product_code"),
      cell: ({ row }) => {
        return row.original.model;
      },
    },
    {
      accessorKey: "tags",
      header: t("Tags"),
      cell: ({ row }) => {
        return row.original.tags.join(", ");
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
      accessorKey: "original_price",
      header: t("original_price"),
      cell: ({ row }) => {
        return row.original.originalPrice;
      },
    },
    {
      accessorKey: "stock",
      header: t("Stock"),
      cell: ({ row }) => {
        return row.original.stock;
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <StatusBadge
            status={row.original.stock > 0 ? "in_stock" : "out_stock"}
          />
        );
      },
    },
  ];

  const sampleData: Product[] = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    slug: "product-" + index,
    name: "Product " + index,
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    price: 100,
    originalPrice: 120,
    model: "Model 1",
    categories: [
      {
        id: 1,
        name: "Category 1",
      },
    ],
    tags: ["tag1", "tag2"],
    note: "This is a note.",
    description: [
      {
        title: "Description",
        content: "This is a description.",
      },
      {
        title: "Additional Info",
        content: "This is additional information.",
      },
    ],
    stock: index % 2 === 0 ? 10 : 0,
  }));

  const handleDelete = (id: number) => {
    toast.success(t("delete_product_x_success", { x:id }));
    
  };

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
