"use client";

import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { ProductCreate, ProductUpdate } from "@/types/api/product/product";
import { useTranslations } from "next-intl";
import RichTextEditor from "../rich_text/RichTextEditor";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type DescriptionFieldArrayProps<T> = {
  ref: React.RefObject<Record<number, string>>;
  fieldArray: UseFieldArrayReturn<any, any, any>;
};

export default function DescriptionFieddArray<
  T extends { title: string; content: string }
>({ ref, fieldArray }: DescriptionFieldArrayProps<T>) {
  const { append, remove, fields } = fieldArray;
  const { control } = useFormContext<ProductCreate | ProductUpdate>();
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: "", content: "" })}
      >
        <Plus className="w-4 h-4 mr-2" />
        {t("new_description_field")}
      </Button>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-xl shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
            <label className="font-medium">{t("Title")}</label>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <FormField
            control={control}
            name={`description.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`description.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={(content) => {
                      field.onChange(content);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
