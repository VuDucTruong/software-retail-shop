import React from "react";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";
import { FormField } from "../ui/form";
import { useTranslations } from "next-intl";

export default function ValueTypeInput() {
  const { control } = useFormContext();
  const t = useTranslations();
  const [type, setType] = React.useState("PERCENTAGE");
  return (
    <div className="flex gap-2 items-center">
      <FormField
        name="value"
        control={control}
        render={({ field }) => (
          <CommonInputOutline title={t('discount_value')}>
            <Input
              {...field}
              type="number"
              max={type === "PERCENTAGE" ? 100 : undefined}
            />
          </CommonInputOutline>
        )}
      />
      <FormField
        name="type"
        control={control}
        render={({ field }) => (
          <CommonInputOutline title={t('discount_type')} className="border-l-0">
            <RadioGroup
              onValueChange={(value) => {
                setType(value);
                field.onChange(value);
              }}
              defaultValue={field.value}
              className="flex items-center space-x-4 py-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
                <Label htmlFor="percentage">{t('Percent')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIXED" id="fixed" />
                <Label htmlFor="fixed">{t('Fixed')}</Label>
              </div>
            </RadioGroup>
          </CommonInputOutline>
        )}
      />
    </div>
  );
}
