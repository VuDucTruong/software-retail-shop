"use client";

import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserDetailDialog from "@/components/user/UserDetailDialog";
import { User } from "@/models/user/user";
import { ColumnDef } from "@tanstack/react-table";
import { UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function CustomerManagementPage() {
  const t = useTranslations();

  const cols: ColumnDef<User>[] = [
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
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="w-full flex items-center justify-center">
            <Avatar className="size-16 border border-border">
              <AvatarImage
                className="object-cover"
                src={row.original.profile.imageUrl}
                alt={row.original.profile.fullName}
              />
              <AvatarFallback className="bg-gray-400">
                {row.original.profile.fullName.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return row.original.profile.email;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return row.original.profile.fullName;
      },
    },

    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt!);

        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusBadge status={row.original.isActive ? "active" : "banned"} />
        );
      },
    },
  ];

  const handleBanUser = (userId: number) => {
    toast.success(t("ban_user_x_success", {x: userId}));

    //toast.error(t("ban_user_error"));
  };

  const sampleData: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    profile: {
      id: i + 1,
      imageUrl: "/best_seller.png",
      email: `user${i + 1}@example.com`,
      fullName: `User ${i + 1}`,
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    disableDate: "",
    role: "customer",
    isActive: i % 2 === 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("transaction_management")}</h2>
          <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <UserDetailDialog user={row} />

                <CommonConfirmDialog
                  triggerName={
                    <Button variant="destructive" size="icon">
                      <UserX className="h-4 w-4" />
                    </Button>
                  }
                  title={t("ban_user_x", { x: row.id })}
                  description={t("ban_user_warning")}
                  onConfirm={() => handleBanUser(row.id)}
                />
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
