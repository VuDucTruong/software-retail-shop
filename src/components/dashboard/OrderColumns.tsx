import { OrderTableItem } from "@/types/order"
import {
    ColumnDef,
  } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { CheckCircle2Icon, LoaderIcon, MoreVerticalIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import TableCellViewer from "./TableCellViewer"


export const lastestOrderCols: ColumnDef<OrderTableItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="data-[state=checked]:border-white"
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      accessorKey: "purchaser",
      header: "Purchaser",
      cell: ({ row }) => (
        <div className="w-32">
            {row.original.purchaser}
        </div>
      ),
    },
    {
        accessorKey: "recipent",
        header: "Recipent",
        cell: ({ row }) => (
          <div>
              {row.original.recipent}
          </div>
        ),
      },
      
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.status === "Done" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div>Target</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.total}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div>Create At</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.createdAt}</div>
      ),
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 data-[state=open]:bg-muted"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Detail</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]