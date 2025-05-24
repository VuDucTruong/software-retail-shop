"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";
import { CategoryMultiSelectField } from "@/components/product/CategoryMultiSelect";

import {
  ProductUpdate,
  ProductUpdateSchema
} from "@/api";
import ProductDescriptionTab from "@/components/product/ProductDescriptionTab";
import ProductGroupComboBox from "@/components/product/ProductGroupComboBox";
import { TagsInput } from "@/components/product/TagInput";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActionToast } from "@/hooks/use-action-toast";
import { flattenObject } from "@/lib/utils";
import { useProductStore } from "@/stores/product.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

export default function CreateProductPage() {
  const pathName = usePathname();
  const id = pathName.split("/").pop() || "";
  const t = useTranslations();

  const fileRef = useRef<HTMLInputElement>(null);
  const [
    lastAction,
    status,
    error,
    getProductById,
    updateProduct,
    selectedProduct,
  ] = useProductStore(
    useShallow((state) => [
      state.lastAction,
      state.status,
      state.error,
      state.getProductById,
      state.updateProduct,
      state.selectedProduct,
    ])
  );

  useEffect(() => {
    getProductById(Number(id));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      form.reset({
        tags: selectedProduct?.tags || [],
        categoryIds: selectedProduct?.categories?.map((item) => item.id) || [],
        name: selectedProduct?.name || "",
        slug: selectedProduct?.slug || "",
        originalPrice: selectedProduct?.originalPrice || 0,
        price: selectedProduct?.price || 0,
        productDescription: selectedProduct?.productDescription,
        image: selectedProduct?.image,
        represent: selectedProduct?.represent || true,
        groupId: selectedProduct?.groupId || null,
      });
    }
  }, [selectedProduct]);

  useActionToast({
    lastAction,
    status,
    errorMessage: error || undefined,
  });

  const form = useForm<ProductUpdate>({
    defaultValues: {
      tags: selectedProduct?.tags || [],
      categoryIds: selectedProduct?.categories?.map((item) => item.id) || [],
      name: selectedProduct?.name || "",
      slug: selectedProduct?.slug || "",
      originalPrice: selectedProduct?.originalPrice || 0,
      price: selectedProduct?.price || 0,
      productDescription: selectedProduct?.productDescription,
      image: null,
      represent: selectedProduct?.represent || true,
      groupId: selectedProduct?.groupId || null,
    },
    resolver: zodResolver(ProductUpdateSchema),
    mode: "onSubmit",
  });

  const handleSubmit = () => {
    form.setValue("id", Number(id));
    form.handleSubmit((data) => {
      updateProduct(flattenObject(data));
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Sản phẩm #{id}</h2>
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
              render={({ field }) => (
                <CommonInputOutline
                  title={t("product_image")}
                  className="col-span-3"
                >
                  <EditAvatarSection
                    field={field}
                    fileRef={fileRef}
                    name={t("upload_image")}
                    avatarHint={t("image_hint")}
                    defaultAvatar={selectedProduct?.imageUrl}
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
              render={({ field }) => (
                <CommonInputOutline title={t("Categories")}>
                  <CategoryMultiSelectField field={field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <CommonInputOutline title={"Nhóm sản phẩm"}>
                  <ProductGroupComboBox field={field} />
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
              {t("Update")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
