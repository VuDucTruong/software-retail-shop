"use client";
import {
  Category,
  CategoryUpdate,
  CategoryUpdateSchema,
} from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";

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
import { PenLine } from "lucide-react";
import { toast } from "sonner";
import { useCategoryStore } from "@/stores/category.store";
import { urlToFile } from "@/lib/utils";

type EditCategoryDialogProps = {
  selectedCategory: Category;
};

export default function EditCategoryDialog(props: EditCategoryDialogProps) {
  const { selectedCategory } = props;
  const t = useTranslations();
  const updateCategory = useCategoryStore(
    (state) => state.updateCategory
  );

  const form = useForm<CategoryUpdate>({
    defaultValues: {
      name: selectedCategory.name,
      image: undefined,
      description: selectedCategory.description,
    },
    resolver: zodResolver(CategoryUpdateSchema),
  });

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setValue("id", selectedCategory.id);
    form.handleSubmit(async (data) => {
      if(!data.image) {
        data.image = await urlToFile(selectedCategory.imageUrl ?? "/empty_img.png");
      }
      updateCategory(data);
    })();
  };


  return (
    <Dialog>
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
