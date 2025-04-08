"use client";

import CardSection from "@/components/dashboard/CardSection";
import { InteractiveLineChart } from "@/components/dashboard/InteractiveLineChart";

import React, { use } from "react";
import rawData from "@/config/data.json";
import { CommmonDataTable } from "@/components/CommonDataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Delete,
  DeleteIcon,
  Edit,
  MoreVerticalIcon,
  RemoveFormatting,
  Trash2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import TableCellViewer from "@/components/dashboard/TableCellViewer";
import { StatusBadge } from "@/components/StatusBadge";
import { z } from "zod";
import { convertPriceToVND } from "@/lib/currency_helper";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
export default function Page() {
  const t = useTranslations();
  const scheme = z.object({
    id: z.string(),
    purchaser: z.string(),
    status: z.string(),
    total: z.number().transform((val) => convertPriceToVND(val)),
    recipent: z.string(),
    createdAt: z.string(),
  });
  const cols: ColumnDef<z.infer<typeof scheme>>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "purchaser",
      header: "Purchaser",
      cell: ({ row }) => <div className="w-32">{row.original.purchaser}</div>,
    },
    {
      accessorKey: "recipent",
      header: "Recipent",
      cell: ({ row }) => <div>{row.original.recipent}</div>,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status="canceled" />,
    },
    {
      accessorKey: "total",
      header: () => <div>Target</div>,
      cell: ({ row }) => <div>{row.original.total}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div>Create At</div>,
      cell: ({ row }) => <div>{row.original.createdAt}</div>,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <CardSection />
      <InteractiveLineChart />
      <Card>
        <CardContent>
          <CommmonDataTable
            columns={cols}
            canSelect
            data={scheme.array().parse(rawData)}
            hasActions
            renderActions={(_) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex size-8" size="icon">
                    <MoreVerticalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem>
                    <Edit /> {t("Edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 /> {t("Delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
