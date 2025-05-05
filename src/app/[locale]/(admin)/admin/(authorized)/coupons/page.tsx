"use client";

import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import TableOptionMenu from "@/components/common/TableOptionMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { Category, CategoryCreate } from "@/models/category";
import { Coupon } from "@/models/coupon";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";

export default function CouponManagementPage() {
  const t = useTranslations();
  const router = useRouter();
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
          <div className="text-muted-foreground">{t("max_reduction_x", {x: row.original.maxAppliedAmount ?? 0})}</div>
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
    }
  ];

  const sampleData: Coupon[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    code: `Coupon ${i + 1}`,
    type: i % 2 === 0 ? "PERCENTAGE" : "FIXED",
    availableFrom: new Date().toISOString(),
    availableTo: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 100),
    minAmount: Math.floor(Math.random() * 100),
    maxAppliedAmount: Math.floor(Math.random() * 100),
    usageLimit: Math.floor(Math.random() * 100),
    description: `Description for Coupon ${i + 1}`,
  }));

  const handleDelete = (id: number) => {
    toast.success(t("Success", { x: id }));
  };

  const handleViewDetails = (id: number) => {
    router.push(`coupons/${id}`);
  };


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
           <TableOptionMenu actions={[
            {
              label: t("Detail"),
              onClick: () => handleViewDetails(row.id!),
            },
            {
              label: t("Delete"),
              onClick: () => handleDelete(row.id!),
              confirm: {
                title: t("delete_coupon_x", { x: row.id! }),
                description: t("delete_coupon_warning"),
              },
            },
           ]}/>
          )}
        />
      </CardContent>
    </Card>
  );
}
