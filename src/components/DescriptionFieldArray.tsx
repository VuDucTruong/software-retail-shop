"use client";

import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useRef } from "react";
import { MdxEditorInput } from "./MDEditor";

type DescriptionItem = {
  title: string;
  content: string;
};

type FormData = {
  description: DescriptionItem[];
};

export default function DescriptionFieddArray() {
  const { control, register, setValue,getValues } = useFormContext<FormData>(
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "description",
  });

  // ref map lưu content tạm thời theo index
  const contentRefs = useRef<Record<number, string>>({});

  const onSubmit = (data: FormData) => {
    // trước khi submit, sync nội dung từ ref về form
    fields.forEach((field, index) => {
      if (contentRefs.current[index] !== undefined) {
        setValue(`description.${index}.content`, contentRefs.current[index]);
      }
    });

    console.log("🚀 Final Data:", getValues("description"));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: "", content: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Description Section
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-xl shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
            <label className="font-medium">Tiêu đề</label>
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
            placeholder="Enter title..."
          />

          <label className="font-medium mt-2 block">Nội dung Markdown</label>
          <MdxEditorInput
            markdown={field.content}
            onChange={(md) => {
              contentRefs.current[index] = md;
            }}
          />
        </div>
      ))}
    </div>
  );
}
