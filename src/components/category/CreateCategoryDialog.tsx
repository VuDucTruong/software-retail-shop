import { CategoryCreate, CategoryCreateSchema } from "@/api";
import { useCategoryStore } from "@/stores/category.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { CgAdd } from "react-icons/cg";
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
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CreateCategoryDialog() {
  const t = useTranslations();
  const form = useForm<CategoryCreate>({
    defaultValues: {
      name: "",
      image: null,
      description: "",
    },
    resolver: zodResolver(CategoryCreateSchema),
  });
  const createCategory = useCategoryStore((state) => state.createCategory);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit((data) => {
      form.reset();
      createCategory(data)
    })();
  };

  return (
    <Dialog onOpenChange={(open) => open && form.reset()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-white">
          <CgAdd /> {t("create_category")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 aria-describedby={undefined}">
        <DialogHeader>
          <DialogTitle asChild className="text-2xl">
            <h2>{t("create_category")}</h2>
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <CommonImageUpload name="image"/>

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
                  {t("create_category")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
