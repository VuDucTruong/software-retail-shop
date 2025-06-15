import React, { useEffect } from 'react'
import { CommmonDataTable } from '../common/table/CommonDataTable'
import { useTranslations } from 'next-intl';
import { ProductTrend } from '@/api';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useDashboardStore } from '@/stores/dashboard.store';

export default function ProductTrendTable() {

    const t = useTranslations();

    const getProductTrends = useDashboardStore((state) => state.getProductTrends);
    const productTrends = useDashboardStore((state) => state.productTrends);

    useEffect(() => {
        getProductTrends();
    }, [getProductTrends]);

    

    const cols: ColumnDef<ProductTrend>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("product_name"),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/products/${row.original.id}`}>
            <Button variant={"link"} className="text-left w-full">
              {row.original.name}
            </Button>
          </Link>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "saleCount",
      header: t("sale_count"),
      cell: ({ row }) => {
        return row.original.totalSold;
      },
      enableHiding: true,
    },
  ];

  return (
    <CommmonDataTable columns={cols} data={productTrends ?? []} isLoading={productTrends === null}  />
  )
}
