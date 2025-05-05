import { Column } from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import React from 'react'

type SortingHeaderProps = {
    column: Column<any, any>;
    title: string;
}

export default function SortingHeader({column , title}: SortingHeaderProps) {
  return (
    <div
          className="flex items-center justify-center gap-1 cursor-pointer select-none"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          {title}{" "}
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              ""
            )
          ) : (
            <ArrowUpDown size={16} />
          )}
        </div>
  )
}
