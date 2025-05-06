"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";
import { CategoryMultiSelectField } from "@/components/product/CategoryMultiSelect";

import ProductDescriptionTab from "@/components/product/ProductDescriptionTab";
import { TagsInput } from "@/components/product/TagInput";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/models/category";
import {
  Product,
  ProductUpdate,
  ProductUpdateScheme,
  ProductValidation,
} from "@/models/product/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const categories:Category[] = [
  { id: 1, name: "Category 1", description: "Description 1", imageUrl: "" },
  { id: 4, name: "Category 2", description: "Description 2", imageUrl: "" },
]
const sampleProduct: Product = {
  id: 1,
  name: "Sample Product",
  slug: "sample-product",
  originalPrice: 100,
  price: 80,
  imageUrl: "/banner.png",
  productDescription: {
    description: "Sample description",
    info: "Sample info",
    platform: "Sample platform",
    policy: "Sample policy",
    tutorial: "Sample tutorial",
  },
  tags: ["sample", "product"],
  categories: categories,
  quantity: 10,
};

export default function EditProductPage() {
  const pathName = usePathname();
  const id = pathName.split("/").pop() || "";

  const t = useTranslations();
  const form = useForm<ProductUpdate>({
    defaultValues: {
      ...sampleProduct,
      categories: sampleProduct.categories?.map((category) => category.id),
    },
   
    mode: "onSubmit",
    resolver: zodResolver(ProductUpdateScheme),
  });

  
  const fileRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    // @ts-ignore
    form.setValue("image", fileRef.current?.files?.[0]);
    console.log("🔥 Form Data before sumbit:", form.getValues());
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
            className=" grid grid-cols-3 space-x-4 gap-6"
          >
            {/* Image Upload */}

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <CommonInputOutline
                  title={t("product_image")}
                  className="col-span-3"
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
                <CommonInputOutline title={t("Tags")}>
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

            <div className="col-span-3">
              <ProductDescriptionTab />
            </div>

            <Button
              className="col-start-3 bg-yellow-400 hover:bg-yellow-500"
              type="submit"
            >
              {t("Update")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
