"use client";
import { CategoryUpdate, CategoryUpdateSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { urlToFile } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category.store";
import { useCategoryDialogStore } from "@/stores/dialog.store";
import { useShallow } from "zustand/shallow";
import { CommonImageUpload } from "../common/CommonImageUpload";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


export default function EditCategoryDialog() {
 
  const [open,selectedCategory]= useCategoryDialogStore(useShallow(state=> [state.open, state.data]));
  
  const t = useTranslations();
  const updateCategory = useCategoryStore((state) => state.updateCategory);

  const form = useForm<CategoryUpdate>({
    defaultValues: {
      name: selectedCategory?.name,
      image: null,
      description: selectedCategory?.description,
    },
    resolver: zodResolver(CategoryUpdateSchema),
  });


  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name,
        image: null, // Reset image to allow re-upload
        description: selectedCategory.description,
      });
    }
  }, [selectedCategory,form]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setValue("id", selectedCategory?.id);
    if (!form.getValues("image")) {
      const image = await urlToFile(
        selectedCategory?.imageUrl??"/empty_img.png"
      );
      form.setValue("image", image);
    }
    form.handleSubmit((data) => {
      updateCategory(data);
    })();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        useCategoryDialogStore.getState().closeDialog();
        form.reset();
      }
      console.log("Dialog closed", val , selectedCategory);
    }}>
      <DialogTrigger asChild>
        <div className="hidden"></div>
      </DialogTrigger>
      <DialogContent className="w-1/2 " aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl" asChild>
            <h2>{t("update_category_x", { x: selectedCategory?.id ?? 0 })}</h2>
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <CommonImageUpload name="image" defaultImageUrl={selectedCategory?.imageUrl}/>

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
