import React, { useEffect } from 'react'
import { CommmonDataTable } from '../common/table/CommonDataTable'
import { useTranslations } from 'next-intl';
import { ProductTrend, SimpleProductTrend } from '@/api';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useShallow } from 'zustand/shallow';

export default function ProductTrendTable() {

    const t = useTranslations();

    const [getProductTrends, productTrends, queryParams] = useDashboardStore(useShallow(state => [
        state.getProductTrends,
        state.productTrends,
        state.queryParams
    ]));

    useEffect(() => {
        getProductTrends(queryParams);
    }, [getProductTrends,queryParams]);

    

    const cols: ColumnDef<SimpleProductTrend>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return row.original.product.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("product_name"),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/products/${row.original.product.id}`}>
            <Button variant={"link"} className="text-left w-full">
              {row.original.product.name}
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
        return row.original.saleCount;
      },
      enableHiding: true,
    },
  ];

  return (
    <CommmonDataTable columns={cols} data={productTrends ?? []} isLoading={productTrends === null}  />
  )
}
