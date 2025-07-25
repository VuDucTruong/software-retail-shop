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
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { IoFilter } from "react-icons/io5";

const FormSchema = z.object({
  description: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export function CommentsFilterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        description: "",
        fromDate: undefined,
        toDate: undefined,
        },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-row items-end gap-4"
        >
            {/* Order id */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Description")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
       
       {/* From Date */}
       <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("from_date")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* To Date */}
          <FormField
            control={form.control}
            name="toDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("to_date")}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">
            <IoFilter />
            {t("Filter")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
