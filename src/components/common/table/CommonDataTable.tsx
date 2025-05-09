import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  RowSelectionState,
  VisibilityState,
  Table as TableType,
  PaginationState,
  Updater,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "../../ui/checkbox";
import CommonTablePagination from "./CommonTablePagination";
import CommonTableVisibility from "./CommonTableVisibility";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  canSelect?: boolean;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  onDeleteRows?: (rows: number[]) => void;
  sorting?: SortingState;
  onSortingChange?: (updater: Updater<SortingState>) => void;
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
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const t = useTranslations();

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
    const selectedRowIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => {
        if(row.original != undefined) {
          return (row.original as any).id;
        } else {
          toast.error("Not found id of row , you need to declare id in your data type");
          return -1;
        }
      });
    setRowSelection({});
    onDeleteRows?.(selectedRowIds);
  };

  return (
    <div className="flex flex-col space-y-4">
      <CommonTableVisibility table={table} />
      <div className="rounded-md border px-2">
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    canSelect && row.toggleSelected();
                  }}
                  className={
                    canSelect
                      ? "relative z-0 data-[state=selected]:bg-primary data-[state=selected]:text-white hover:bg-muted"
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
        </Table>
      </div>
      <div className="flex items-center justify-end">
        {canSelect && (
          <div className="hidden flex-1 lg:flex">
            <Button variant={"destructive"} onClick={hanndleDeleteRows} disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
              {t("delete_selected_x_of_y", {
                x: table.getFilteredSelectedRowModel().rows.length,
                y: table.getFilteredRowModel().rows.length,
              })}
            </Button>
          </div>
        )}

        {pagination && <CommonTablePagination table={table}/>}
      </div>
    </div>
  );
}

