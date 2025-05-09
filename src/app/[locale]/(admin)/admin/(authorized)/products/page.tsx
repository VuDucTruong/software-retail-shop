"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import { CommmonDataTable } from "@/components/common/table/CommonDataTable";
import TableOptionMenu from "@/components/common/TableOptionMenu";
import KeyFileUploadDialog from "@/components/product/KeyFileUploadDialog";
import ProductFilterSheet from "@/components/product/ProductFilterSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { Product } from "@/api";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";


const sampleData: Product[] = [];
export default function ProductManagementPage() {
  const t = useTranslations();
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
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
          <Image alt={row.original.id!.toString()} src={row.original.imageUrl ?? ""} fill className="rounded-md object-cover" />
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
        return <TableOptionMenu actions={[
          {
            label: t("Detail"),
            onClick: () => handleViewDetails(row.original.id!),
          },
          {
            label: t("Delete"),
            onClick: () => handleDelete(row.original.id!),
            confirm: {
              title: t("delete_product_x", { x: row.original.id! }),
              description: t("delete_product_warning"),
            },
          },
        ]} />
      }
    }
  ];



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
            <KeyFileUploadDialog />
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
