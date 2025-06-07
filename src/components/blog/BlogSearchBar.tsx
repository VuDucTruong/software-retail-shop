import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientCategoryState } from "@/stores/cilent/client.category.store";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import debounce from "lodash/debounce";
import { PackageSearch, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, z } from "zod";
import { Form, FormField } from "../ui/form";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

const SearchSchema = z
  .object({
    search: z.string(),
  })
  .partial();

export default function BlogSearchBar() {
  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      search: "",
    },
  });


  const router = useRouter();
  const t = useTranslations();

  const debouncedSearch = React.useMemo(
    () =>
      debounce((data: z.infer<typeof SearchSchema>) => {
        //   searchProducts({
        //     pageRequest: {
        //       page: 0,
        //       size: 10,
        //       sortBy: "createdAt",
        //       sortDirection: "desc",
        //     },
        //     search: data.search,
        //   });	
      }, 400),
    []
  );

  useEffect(() => {
    const subscription = form.watch((data) => {
      debouncedSearch(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit((data) => {

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== "all")
      );

      const searchParams = new URLSearchParams();

      searchParams.set("search", cleanData.search ?? "");
      searchParams.set("page", "0");

      router.push(`/blog/search?${searchParams.toString()}`);
      
    })();
  };

  return (
    <Popover open={form.watch("search") !== ""}>
      <PopoverTrigger asChild>
        <Form {...form}>
          <form
            className="flex items-center w-full max-w-md border-b rounded-md border-border shadow-sm"
            onSubmit={handleSubmit}
          >

            <FormField
              name="search"
              control={form.control}
              render={({ field }) => {
                return (
                  <Input
                    placeholder={t('search_hint')}
                    className="flex-1 border-none focus-visible:ring-0 shadow-none"
                    {...field}
                  />
                );
              }}
            />
            <Button variant="ghost" className="p-2 hover:bg-accent/80  text-gray-500 cursor-pointer" type="submit">
              <Search className="w-5 h-5 " />
            </Button>
          </form>
        </Form>
      </PopoverTrigger>
      <PopoverContent
        className="p-4 w-lg"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col  gap-3">
          {/* {search?.data.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                router.push("/blog/" + item.slug);
              }}
              className="flex items-center cursor-pointer hover:text-primary hover:opacity-80 gap-2 hover:underline"
            >
              <PackageSearch />
              <span>{item.name}</span>
            </div>
          ))}

          {search?.data.length === 0 && (
            <div className="flex items-center justify-center cursor-pointer hover:text-primary hover:opacity-80 gap-2">
              <span className="text-muted-foreground italic">
                {t("no_matching_x", { x: t("blogs") })}
              </span>
            </div>
          )} */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
