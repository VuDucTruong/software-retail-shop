import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, Row, RowData } from "@tanstack/react-table";
import React from "react";

type Props = {
    row: Row<RowData>;
    canSelect?: boolean;
    isDeleted: boolean;
}

export default function CommonTableRow({ row, canSelect = false, isDeleted }: Props) {

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className={cn(
        "",
        canSelect &&
          "relative z-0 data-[state=selected]:bg-zinc-200 data-[state=selected]:text-black",
        isDeleted && "opacity-50 line-through"
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="text-center">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
