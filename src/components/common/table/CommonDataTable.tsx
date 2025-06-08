import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";
import { Checkbox } from "../../ui/checkbox";
import CommonConfirmDialog from "../CommonConfirmDialog";
import CommonTablePagination from "./CommonTablePagination";
import CommonTableVisibility from "./CommonTableVisibility";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  canSelect?: boolean;
  pageCount?: number;
  totalCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  onDeleteRows?: (rows: number[]) => void;
  sorting?: SortingState;
  onSortingChange?: (updater: Updater<SortingState>) => void;
  objectName?: string;
  selectCol?: React.ReactNode;
}

export function CommmonDataTable<TData, TValue>({
  columns,
  data,
  canSelect = false,
  onDeleteRows,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  totalCount,
  isLoading,
  onSortingChange,
  objectName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const t = useTranslations();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  // Add selection and actions columns if needed
  const tableColumns = React.useMemo(() => {
    const cols = [...columns];

    if (canSelect) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              className="data-[state=checked]:border-white border-black"
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              className="data-[state=checked]:border-white border-black"
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columns, canSelect]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      rowSelection,
      columnVisibility,
      pagination,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    manualPagination: !!pagination,
    pageCount,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    manualSorting: sorting !== undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const hanndleDeleteRows = () => {
    const ids = getSelectedIds();
    setRowSelection({});
    onDeleteRows?.(ids);
  };

  const getSelectedIds = (): number[] => {
    const selectedRowIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => {
        if (row.original != undefined) {
          return (row.original as any).id;
        } else {
          toast.error(t("error_no_id_in_row"));
          return [];
        }
      });
    return selectedRowIds;
  };

  return (
    <div className="flex flex-col space-y-4">
      <CommonTableVisibility table={table} />
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading || !mounted ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <Skeleton className="size-full" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    // onClick={() => {
                    //   canSelect && row.toggleSelected();
                    // }}
                    className={
                      canSelect
                        ? "relative z-0 data-[state=selected]:bg-zinc-200 data-[state=selected]:text-black hover:bg-muted"
                        : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center"
                  >
                    {t("no_results")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end">
        {canSelect && (
          <div className="hidden flex-1 lg:flex">
            <CommonConfirmDialog
              title={`${t("Delete")} ${
                table.getFilteredSelectedRowModel().rows.length
              } ${objectName}`}
              description={t("table_delete_warning", {
                x: `${objectName} ${getSelectedIds().join(", ")}`,
              })}
              triggerName={
                <Button
                  variant={"destructive"}
                  disabled={
                    table.getFilteredSelectedRowModel().rows.length === 0
                  }
                >
                  {t("delete_selected_x_of_y", {
                    x: table.getFilteredSelectedRowModel().rows.length,
                    y: totalCount?.toString() ?? "0",
                  })}
                </Button>
              }
              onConfirm={hanndleDeleteRows}
            />
          </div>
        )}

        {pagination && <CommonTablePagination table={table} />}
      </div>
    </div>
  );
}
