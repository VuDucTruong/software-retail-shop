"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { MDXEditor } from "@mdxeditor/editor";
import { useRef } from "react";
import { TagsInput } from "@/components/product/TagInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCreate } from "@/types/api/product";
import { Form } from "@/components/ui/form";
import { MdxEditorInput } from "@/components/MDEditor";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import ComboBoxMultiArray from "@/components/MyCombobox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import DescriptionFieddArray from "@/components/DescriptionFieldArray";

export default function CreateProductPage() {
  const methods = useForm<ProductCreate>({
    defaultValues: {
      description: [],
      tags: [],
      categories: [],
      price: 0,
      originalPrice: 0,
    },
  });

  const { control, register, handleSubmit, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "description",
  });

  const noteRef = useRef<string>("");
  const descriptionRefs = useRef<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const onSubmit = (data: ProductCreate) => {
    setValue("note", noteRef.current || "");

    // For description fields, set the content from the refs
    fields.forEach((field, index) => {
      if (descriptionRefs.current[index] !== undefined) {
        setValue(
          `description.${index}.content`,
          descriptionRefs.current[index]
        );
      }
    });

    const finalData = methods.getValues();
    console.log("🔥 Form Data:", finalData);
  };
  const OPTIONS = ["React", "Vue", "Svelte", "Angular"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Create Product</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 grid grid-cols-3 gap-6"
          >
            {/* Image Upload */}
            <CreateProductInputSection
              title="Hình ảnh sản phẩm"
              className="grid col-span-3"
            >
              <EditAvatarSection
                ref={fileRef}
                name="Image"
                avatarHint="nothing..."
              />
            </CreateProductInputSection>

            {/* Text Inputs */}
            <CreateProductInputSection title="Thông tin sản phẩm">
              <Input placeholder="Tên sản phẩm" {...register("name")} />
            </CreateProductInputSection>
            <CreateProductInputSection title="Thông tin sản phẩm">
              <Input placeholder="Slug URL" {...register("slug")} />
            </CreateProductInputSection>
            <CreateProductInputSection title="Thông tin sản phẩm">
              <Input placeholder="Model sản phẩm" {...register("model")} />
            </CreateProductInputSection>

            <CreateProductInputSection title="Thông tin sản phẩm">
              <Input
                type="number"
                placeholder="Giá gốc"
                {...register("originalPrice")}
              />
            </CreateProductInputSection>
            <CreateProductInputSection title="Thông tin sản phẩm">
              <Input
                type="number"
                placeholder="Giá bán"
                {...register("price")}
              />
            </CreateProductInputSection>

            {/* Note Editor */}
            <CreateProductInputSection
              title="Ghi chú sản phẩm"
              className="col-span-3"
            >
              <MdxEditorInput
                markdown={""}
                onChange={(md) => {
                  noteRef.current = md;
                }}
              />
            </CreateProductInputSection>

            {/* Tags Multi-select */}

            <CreateProductInputSection title="Tags">
              <TagsInput />
            </CreateProductInputSection>

            {/* Categories Multi-select */}
            <CreateProductInputSection title="Categories">
            <ComboBoxMultiArray />
            </CreateProductInputSection>
            
            
            {/* Description FieldArray */}
            <CreateProductInputSection title="Mô tả sản phẩm" className="col-span-3">
              <DescriptionFieddArray
              />
            </CreateProductInputSection>
            <Button type="submit">Lưu sản phẩm</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CreateProductInputSection({
  title,
  children,
  className,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className} border-l-2 border-primary pl-4`}>
      <div className="font-semibold text-lg">{title}</div>
      {children}
    </div>
  );
}
