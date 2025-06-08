"use client";
import { Category, CategoryUpdate, CategoryUpdateSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

import { urlToFile } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category.store";
import { PenLine } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type EditCategoryDialogProps = {
  selectedCategory: Category;
};

export default function EditCategoryDialog(props: EditCategoryDialogProps) {
  const { selectedCategory } = props;
  const t = useTranslations();
  const updateCategory = useCategoryStore((state) => state.updateCategory);

  const form = useForm<CategoryUpdate>({
    defaultValues: {
      name: selectedCategory.name,
      image: null,
      description: selectedCategory.description,
    },
    resolver: zodResolver(CategoryUpdateSchema),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setValue("id", selectedCategory.id);
    if (!form.getValues("image")) {
      const image = await urlToFile(
        selectedCategory.imageUrl
      );
      form.setValue("image", image);
    }
    form.handleSubmit((data) => {
      updateCategory(data);
    })();
  };

  return (
    <Dialog onOpenChange={(open) => open && form.reset()}>
      <DialogTrigger asChild>
        <Button className="size-8 bg-yellow-400 hover:bg-yellow-500">
          <PenLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 aria-describedby={undefined}">
        <DialogHeader>
          <DialogTitle className="text-2xl" asChild>
            <h2>{t("update_category_x", { x: selectedCategory.id })}</h2>
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Image")}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        ref={field.ref}
                        accept="image/*"
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      <Image
                        alt="category image"
                        src={
                          field.value == null
                            ? selectedCategory.imageUrl ?? "/empty_img.png"
                            : URL.createObjectURL(field.value)
                        }
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Description")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-white">
                  {t("Confirm")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
