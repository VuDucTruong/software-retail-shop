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
import { Button } from "./ui/button";

type SimpleTableProps = {
  data: any[];
  columns: { header: string; accessorKey: string }[];
  hasAction?: boolean;
};

export default function SimpleTable({
  data,
  columns,
  hasAction = false,
}: SimpleTableProps) {
  const t = useTranslations();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.accessorKey}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.accessorKey}>
                  {row[col.accessorKey]}
                </TableCell>
              ))}
              {hasAction && (
                <TableCell>
                  <Button variant={"link"} className="btn btn-primary btn-sm">{t('Detail')}</Button>
                </TableCell>
              )}
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
