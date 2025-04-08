import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { CustomerOrderItem } from "@/types/customer_order_item";
import { useRouter } from "next/navigation";

type OrderTableProps = {
  data: CustomerOrderItem[];
  columns: { header: string; accessorKey: keyof CustomerOrderItem }[];
  hasAction?: boolean;
};

export default function OrderTable({ data, columns,hasAction=true }: OrderTableProps) {
  const t = useTranslations();

  const handleStatusColor = (status: string) => {
    switch (status) {
      case "ORDER_STATUS.PENDING":
        return "text-yellow-500";
      case "ORDER_STATUS.COMPLETED":
        return "text-green-500";
      case "ORDER_STATUS.PROCESSING":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  }
  const router = useRouter();
  const handleDetailClick = (orderId: string) => {
    // Handle the detail click event here
    router.push(`orders/${orderId}`);
    
  }
  return (
    <Table className="border border-border border-collapse">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.accessorKey}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody >
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => {
                if (col.accessorKey === "status") {
                  return (
                    <TableCell key={col.accessorKey} className={handleStatusColor(row[col.accessorKey])}>
                      {t(row[col.accessorKey])}
                    </TableCell>
                  );
                }

                return (
                    <TableCell key={col.accessorKey}>
                      {row[col.accessorKey]}
                    </TableCell>
                  );
              })}
              <TableCell>
                <Button variant={"link"} onClick={()=>handleDetailClick(row.order_id)} className="cusor-pointer">
                  {t("Detail")}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              {t("no_data_available")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
