import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export default function CouponTypeSelect({ ...props }: React.ComponentProps<React.FC<SelectProps>>) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Loại mã giảm giá" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
        <SelectItem value="FIXED">Cố định (VNĐ)</SelectItem>
        <SelectItem value="BOTH">Cả hai</SelectItem>
      </SelectContent>
    </Select>
  );
}
