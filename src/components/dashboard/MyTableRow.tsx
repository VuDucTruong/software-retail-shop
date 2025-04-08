import { flexRender, Row } from "@tanstack/react-table"
import { TableCell, TableRow } from "../ui/table"

export default function MyTableRow({ row }: { row: Row<any> }) {

    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onClick={() => {
          row.toggleSelected()
          console.log("Selected row")
          
        }}
        className="relative z-0 data-[state=selected]:bg-primary data-[state=selected]:text-white hover:bg-muted"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    )
  }
  