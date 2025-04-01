"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CommonCombobox } from "./CommonCombobox";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { IoFilter } from "react-icons/io5";
import { LuListRestart } from "react-icons/lu";

const FormSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sort: z.string().optional(),
});

export function FilterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        category: "",
        tag: "",
        minPrice: "0",
        maxPrice: "",
        sort: "",
        },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }
  const onClearFilter = () => {
    form.reset();
  };

  const tempData = ["item1", "item2", "item3", "item4"];
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-row items-end justify-between"
        >
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Category")}</FormLabel>
                <CommonCombobox
                  data={tempData}
                  field={field}
                  form={form}
                  name="category"
                  title={t("Category")}
                />
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Tag")}</FormLabel>
                <CommonCombobox
                  data={tempData}
                  field={field}
                  form={form}
                  name="tag"
                  title={t("Tag")}
                />
              </FormItem>
            )}
          />
          {/* Price */}
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("price_from")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    step={1000}
                    type="number"
                    min={0}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("price_to")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    step={1000}
                    type="number"
                    min={0}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Sort */}
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Sort")}</FormLabel>
                <CommonCombobox
                  data={tempData}
                  field={field}
                  form={form}
                  name="sort"
                  title={t("Sort")}
                />
              </FormItem>
            )}
          />

          <Button type="submit">
            <IoFilter />
            {t("Filter")}
          </Button>
        </form>
      </Form>
      <Button onClick={onClearFilter} className="w-fit">
        <LuListRestart /> {t("reset_filter")}
      </Button>
    </div>
  );
}
