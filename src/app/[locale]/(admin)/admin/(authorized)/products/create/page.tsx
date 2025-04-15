"use client";

import CommonInputOutline from "@/components/CommonInputOutline";
import { MdxEditorInput } from "@/components/MDEditor";
import CategoryMultiSelect from "@/components/product/CategoryMultiSelect";
import DescriptionFieddArray from "@/components/product/DescriptionFieldArray";
import { TagsInput } from "@/components/product/TagInput";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductCreate } from "@/types/api/product";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function CreateProductPage() {
  const t = useTranslations();
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
  const descriptionFieldArray = useFieldArray({
    control,
    name: "description",
  });

  const noteRef = useRef<string>("");
  const descriptionRefs = useRef<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const onSubmit = (data: ProductCreate) => {
    setValue("note", noteRef.current || "");
    setValue("image", fileRef.current?.files?.[0] || null);
    // For description fields, set the content from the refs
    descriptionFieldArray.fields.forEach((field, index) => {
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
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t('create_product')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 grid grid-cols-3 gap-6"
          >
            {/* Image Upload */}
            <CommonInputOutline
              title={t('product_image')}
              className="grid col-span-3"
            >
              <EditAvatarSection
                ref={fileRef}
                name={t('upload_image')}
                avatarHint={t('image_hint')}
              />
            </CommonInputOutline>

            {/* Text Inputs */}
            <CommonInputOutline title={t('product_name')}>
              <Input placeholder={t('product_name')} {...register("name")} />
            </CommonInputOutline>
            <CommonInputOutline title="Slug">
              <Input placeholder="Slug" {...register("slug")} />
            </CommonInputOutline>
            <CommonInputOutline title={t('product_code')}>
              <Input placeholder={t('product_code')} {...register("model")} />
            </CommonInputOutline>

            <CommonInputOutline title={t('original_price')}>
              <Input
                type="number"
                placeholder={t('original_price')}
                {...register("originalPrice")}
              />
            </CommonInputOutline>
            <CommonInputOutline title={t('Price')}>
              <Input
                type="number"
                placeholder={t('Price')}
                {...register("price")}
              />
            </CommonInputOutline>

            {/* Note Editor */}
            <CommonInputOutline
              title={t('Note')}
              className="col-span-3"
            >
              <MdxEditorInput
                markdown={""}
                onChange={(md) => {
                  noteRef.current = md;
                }}
              />
            </CommonInputOutline>

            {/* Tags Multi-select */}

            <CommonInputOutline title={t("Tags")}>
              <TagsInput />
            </CommonInputOutline>

            {/* Categories Multi-select */}
            <CommonInputOutline title={t('Categories')}>
              <CategoryMultiSelect />
            </CommonInputOutline>
             
            {/* Description FieldArray */}
            <CommonInputOutline title={t('product_description')} className="col-span-3">
              <DescriptionFieddArray
                ref={descriptionRefs}
                fieldArray={descriptionFieldArray}
              />
            </CommonInputOutline>
            <Button className="col-start-3 bg-green-500 hover:bg-green-400" type="submit">{t('create_product')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


