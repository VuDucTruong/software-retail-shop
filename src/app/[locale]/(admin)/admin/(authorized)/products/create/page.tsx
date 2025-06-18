"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";
import { CategoryMultiSelectField } from "@/components/product/CategoryMultiSelect";

import { ProductCreate, ProductCreateSchema } from "@/api";
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
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { RiResetLeftFill } from "react-icons/ri";

export default function CreateProductPage() {
  const t = useTranslations();

  const [createProduct, lastAction, status, error] = useProductStore(
    useShallow((state) => [
      state.createProduct,
      state.lastAction,
      state.status,
      state.error,
    ])
  );

  useActionToast({
    lastAction,
    status,
    errorMessage: error || undefined,
  });

  const form = useForm<ProductCreate>({
    defaultValues: {
      tags: [],
      categoryIds: [],
      name: "",
      slug: "",
      originalPrice: 0,
      price: 0,
      image: null,
      represent: true,
      productDescription: {
        description: "",
        info: "",
        platform: "",
        policy: "",
        tutorial: "",
      },
      groupId: null,
    },
    resolver: zodResolver(ProductCreateSchema),
    mode: "onSubmit",
  });


  const handleSubmit = () => {
    form.handleSubmit((data) => {
      createProduct(flattenObject(data) as ProductCreate);
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("create_product")}</h2>
          <Button variant={"destructive"} onClick={() => {
            form.reset();
          }}>
            <RiResetLeftFill /> {t("Reset")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
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
                  required
                >
                  <EditAvatarSection
                    avatarClassname="h-40 w-full"
                    field={field}
                    name="image"
                    avatarHint={t("image_hint")}
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CommonInputOutline required title={t("product_name")}>
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
                <CommonInputOutline title={t("original_price")} required>
                  <Input
                    type="number"
                    step={100}
                    min={0}
                    placeholder={t("original_price")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
                <CommonInputOutline title={t("Price")} required>
                  <Input
                    step={100}
                    placeholder={t("Price")}
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
                <CommonInputOutline title={t("Tags")} required>
                  <TagsInput field={field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <CommonInputOutline title={t("Categories")} required>
                  <CategoryMultiSelectField field={field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <CommonInputOutline title={t("product_group")} required>
                  <ProductGroupComboBox field={field} />
                </CommonInputOutline>
              )}
            />

            <div className="col-span-3">
              <ProductDescriptionTab />
            </div>

            <Button
              className="col-start-3 bg-green-400 hover:bg-green-500"
              type="button"
              onClick={handleSubmit}
            >
              {t("Create")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
