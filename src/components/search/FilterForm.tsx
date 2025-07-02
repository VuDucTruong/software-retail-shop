"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { IoFilter } from "react-icons/io5";
import { LuListRestart } from "react-icons/lu";
import { Input } from "../ui/input";
import CategorySelect from "./CategorySelect";
import TagSelect from "./TagSelect";

const FormSchema = z.object({
  priceFrom: z.string().optional(),
  priceTo: z.string().optional(),
  categoryId: z.number().array().optional(),
  tag: z.string().array().optional(),
  sort: z.string().optional(),
});

const sortOptions = [
  {
    value: "id,asc",
    label: "Default",
  },
  {
    value: "createdAt,desc",
    label: "Newest",
  },
  {
    value: "price,asc",
    label: "Price: Low to High",
  },
  {
    value: "price,desc",
    label: "Price: High to Low",
  },
  {
    value: "name,asc",
    label: "Name: A to Z",
  },
  {
    value: "name,desc",
    label: "Name: Z to A",
  },
];

export function FilterForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "-1";
  const tag = searchParams.get("tag") || "all";
  const priceFrom = searchParams.get("priceFrom") || "";
  const priceTo = searchParams.get("priceTo") || "";
  const sort = searchParams.get("sort") || "createdAt,desc";
  const search = searchParams.get("search") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priceFrom: priceFrom,
      priceTo: priceTo,
      categoryId: [Number(categoryId)],
      tag: [tag],
      sort: sort !== "" ? sort : sortOptions[0].value,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {


    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== undefined && value !== "" && key !== "sort"
      )
    );

    const urlParams = new URLSearchParams();
    urlParams.set("page", "0");
    urlParams.set("sort", data.sort || "id,asc");
    urlParams.set("search", search);

    Object.entries(cleanedData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, v.toString()));
      } else {
        urlParams.set(key, value.toString());
      }
    });

    router.push(`/search?${urlParams.toString()}`);

  }
  const onClearFilter = () => {
    form.reset({
      priceFrom: "",
      priceTo: "",
      categoryId: [-1],
      tag: ["all"],
      sort: sortOptions[0].value,
    })
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-row items-end justify-between gap-4"
        >
          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Category")}</FormLabel>
                <FormControl>
                  <CategorySelect
                    value={field.value?.[0]}
                    onChange={(val) => field.onChange([val])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Tags")}</FormLabel>
                <FormControl>
                  <TagSelect
                    value={field.value?.[0]}
                    onChange={(val) => field.onChange([val])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Price */}
          <FormField
            control={form.control}
            name="priceFrom"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Giá trị từ</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Giá trị từ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceTo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Đến giá trị</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Giá trị đến" {...field} />
                </FormControl>
                <FormMessage />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit">
            <IoFilter />
            {t("Filter")}
          </Button>

          <Button
            variant={"destructive"}
            onClick={onClearFilter}
            className="w-fit"
          >
            <LuListRestart /> {t("reset_filter")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
