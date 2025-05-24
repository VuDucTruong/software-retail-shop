import React from "react";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { FormField } from "../ui/form";
import { useTranslations } from "next-intl";
import CouponTypeSelect from "./CouponTypeSelect";

export default function ValueTypeInput() {
  const form = useFormContext();
  const t = useTranslations();
  return (
    <div className="flex gap-2 items-center">
      
    </div>
  );
}
