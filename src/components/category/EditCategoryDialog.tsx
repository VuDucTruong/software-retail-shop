"use client";
import {
  Category,
  CategoryUpdate,
  CategoryUpdateScheme,
} from "@/types/api/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect } from "react";
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
import { MdUpdate } from "react-icons/md";
import { PenLine } from "lucide-react";
import { toast } from "sonner";

type EditCategoryDialogProps = {
  onUpdate?: (data: CategoryUpdate) => void;
};

const selectedCategory: Category = {
  id: 1,
  name: "Sample Category",
  description: "This is a sample category",
  imageUrl:
    "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png",
};

export default function EditCategoryDialog(props: EditCategoryDialogProps) {
  const { onUpdate } = props;
  const t = useTranslations();
  const form = useForm<CategoryUpdate>({
    defaultValues: {
      name: selectedCategory.name,
      image: null,
      description: selectedCategory.description,
    },
    resolver: zodResolver(CategoryUpdateScheme),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setValue("id", selectedCategory.id);
    form.handleSubmit((data) => {
      console.log(data);
      onUpdate?.(data);
      toast.success(t("update_category_success"));
      // Handle form submission logic here
      // For example, you can send the data to an API endpoint
    })();
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-8">
          <PenLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
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
                            ? selectedCategory.imageUrl
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
