"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";
import { CategoryMultiSelectField } from "@/components/product/CategoryMultiSelect";

import ProductDescriptionTab from "@/components/product/ProductDescriptionTab";
import { TagsInput } from "@/components/product/TagInput";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductCreate, ProductCreateSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProductStore } from "@/stores/product.store";
import { useShallow } from "zustand/shallow";
import { useActionToast } from "@/hooks/use-action-toast";
import ProductGroupComboBox from "@/components/product/ProductGroupComboBox";

export default function CreateProductPage() {

  const t = useTranslations();

  const [createProduct , lastAction , status , error] = useProductStore(useShallow((state) => [
    state.createProduct,
    state.lastAction,
    state.status,
    state.error,
  ]));

  useActionToast({
    lastAction, status , errorMessage: error || undefined})

  const form = useForm<ProductCreate>({
    defaultValues: {
      tags: [],
      categoryIds: [],
      name: "",
      slug: "",
      originalPrice: 0,
      price: 0,
      productDescription: {
        description: "",
        info: "",
        platform: "",
        policy: "",
        tutorial: "",
      }
    },
    resolver: zodResolver(ProductCreateSchema),
    mode: "onSubmit",
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    
    form.handleSubmit((data) => {
      createProduct(data)
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("create_product")}</h2>
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
              render={({field}) => (
                <CommonInputOutline
                  title={t("product_image")}
                  className="col-span-3"
                >
                  <EditAvatarSection
                    field={field}
                    fileRef={fileRef}
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
                    step={100}
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
                    step={100}
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
              name="categoryIds"
              render={({field}) => (
                <CommonInputOutline title={t("Categories")}>
                  <CategoryMultiSelectField field={field}/>
                </CommonInputOutline>
              )}
            />


              {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="groupId"
              render={({field}) => (
                <CommonInputOutline title={"Nhóm sản phẩm"}>
                  <ProductGroupComboBox field={field}/>
                </CommonInputOutline>
              )}
            />


            <div className="col-span-3">
              <ProductDescriptionTab />
            </div>

            <Button
              className="col-start-3 bg-green-400 hover:bg-green-500"
              type="submit"
            >
              {t("Create")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
