import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CouponTypeSelectProps extends React.ComponentProps<typeof Select> {
  hasAllOption?: boolean;
}

export default function CouponTypeSelect({
  hasAllOption = true,
  ...props
}: CouponTypeSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Loại mã giảm giá" />
      </SelectTrigger>
      <SelectContent>
        {hasAllOption && <SelectItem value="ALL">Tất cả</SelectItem>}
        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
        <SelectItem value="FIXED">Cố định (VNĐ)</SelectItem>
      </SelectContent>
    </Select>
  );
}
