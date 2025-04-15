"use client";

import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { ProductCreate, ProductUpdate } from "@/types/api/product";
import { useTranslations } from "next-intl";
import RichTextEditor from "../rich_text/RichTextEditor";

type DescriptionFieldArrayProps<T> = {
  ref: React.RefObject<Record<number, string>>;
  fieldArray: UseFieldArrayReturn<any, any, any>; 
};

export default function DescriptionFieddArray<T extends { title: string; content: string }>({ ref,fieldArray }: DescriptionFieldArrayProps<T>) {
  const { append, remove, fields } = fieldArray;
  const { register } = useFormContext<ProductCreate | ProductUpdate>(
  );
  const t= useTranslations();

  return (
    <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: "", content: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('new_description_field')}
        </Button>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-xl shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
            <label className="font-medium">{t('Title')}</label>
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

          <Input
            {...register(`description.${index}.title` as const)}
            
          />

          <label className="font-medium mt-2 block">{t('Content')}</label>

          <RichTextEditor
            content={field.content}
            onChange={(content) => {
              ref.current[index] = content;
            }}
          />
        </div>
      ))}
    </div>
  );
}
