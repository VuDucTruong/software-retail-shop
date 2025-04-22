"use client";

import CommonInputOutline from "@/components/CommonInputOutline";
import { CategoryMultiSelectField } from "@/components/product/CategoryMultiSelect";

import DescriptionFieddArray from "@/components/product/DescriptionFieldArray";
import { TagsInput } from "@/components/product/TagInput";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import RichTextEditor from "@/components/rich_text/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  convertProductToProductUpdate,
  Description,
  Product,
  ProductCreate,
  ProductCreateScheme,
  ProductUpdate,
  ProductUpdateScheme,
} from "@/types/api/product/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";


export default function CreateProductPage() {
  const pathName = usePathname();
  const id = pathName.split("/").pop() || "";

  const t = useTranslations();
  const form = useForm<ProductCreate>({
    defaultValues: {
      productDescription: [],
      tags: [],
      categories: [],
      price: 0,
      originalPrice: 0,
    },
    resolver: zodResolver(ProductCreateScheme),
    mode: "onSubmit",
  });

  const descriptionFieldArray = useFieldArray({
    control: form.control,
    name: "description",
  });

  const noteRef = useRef<string>("");
  const descriptionRefs = useRef<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    form.setValue("note", noteRef.current);

    // @ts-ignore
    form.setValue("image", fileRef.current?.files?.[0]);
    // For description fields, set the content from the refs
    descriptionFieldArray.fields.forEach((field, index) => {
      if (descriptionRefs.current[index] !== undefined) {
        form.setValue(
          `description.${index}.content`,
          descriptionRefs.current[index]
        );
      }
    });

    form.handleSubmit((data) => {
      console.log("🔥 Form Data:", data);
      toast.success(t("update_product_success"));
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("product_x", { x: id })}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6 grid grid-cols-3 gap-6"
          >
            {/* Image Upload */}

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <CommonInputOutline
                  title={t("product_image")}
                  className="grid col-span-3"
                >
                  <EditAvatarSection
                    ref={fileRef}
                    name={t("upload_image")}
                    avatarHint={t("image_hint")}
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CommonInputOutline title={t("product_name")}>
                  <Input placeholder={t("product_name")} {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <CommonInputOutline title="Slug">
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <CommonInputOutline title={t("product_code")}>
                  <Input placeholder={t("product_code")} {...field} />
                </CommonInputOutline>
              )}
            />
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <CommonInputOutline title={t("original_price")}>
                  <Input
                    type="number"
                    step={1000}
                    placeholder={t("original_price")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </CommonInputOutline>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <CommonInputOutline title={t("Price")}>
                  <Input
                    step={1000}
                    placeholder={t("Price")}
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </CommonInputOutline>
              )}
            />
            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <CommonInputOutline title={t("Tags")} className="col-span-2">
                  <TagsInput field={field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <CommonInputOutline title={t("Categories")}>
                  <CategoryMultiSelectField />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <CommonInputOutline title={t("Note")} className="col-span-3">
                  <RichTextEditor
                    content={field.value}
                    onChange={(value) => {
                      noteRef.current = value;
                    }}
                  />
                </CommonInputOutline>
              )}
            />

            {/* Description FieldArray */}

            <div className="col-span-3">
              <h4 className="mb-2">{t("product_description")}</h4>
              <DescriptionFieddArray
                ref={descriptionRefs}
                fieldArray={descriptionFieldArray}
              />
            </div>

            <Button
              className="col-start-3 bg-green-400 hover:bg-green-500"
              type="submit"
            >
              {t("create_product")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
