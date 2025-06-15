import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface CouponTypeSelectProps extends React.ComponentProps<typeof Select> {
  hasAllOption?: boolean;
}

export default function CouponTypeSelect({
  hasAllOption = true,
  ...props
}: CouponTypeSelectProps) {
  const t = useTranslations();
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('coupon_type')} />
      </SelectTrigger>
      <SelectContent>
        {hasAllOption && <SelectItem value="ALL">{t('All')}</SelectItem>}
        <SelectItem value="PERCENTAGE">{t('Percentage')} (%)</SelectItem>
        <SelectItem value="FIXED">{t('Fixed')} (VNĐ)</SelectItem>
      </SelectContent>
    </Select>
  );
}
