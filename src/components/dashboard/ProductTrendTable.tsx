import { SimpleProductTrend } from '@/api';
import { useDashboardStore } from '@/stores/dashboard.store';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { CommmonDataTable } from '../common/table/CommonDataTable';
import { Button } from '../ui/button';

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
