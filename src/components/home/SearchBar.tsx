import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, PackageSearch } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategoryStore } from "@/stores/category.store";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Form, FormField } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProductStore } from "@/stores/product.store";
import debounce from "lodash/debounce";
import { useClientCategoryState } from "@/stores/cilent/client.category.store";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { Skeleton } from "../ui/skeleton";

const SearchSchema = z
  .object({
    category: z.string(),
    search: z.string(),
  })
  .partial();

export default function SearchBar() {
  const [mounted , setMounted] = useState(false);
  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      category: "-1",
      search: "",
    },
  });
  const getCategories = useClientCategoryState((state) => state.getCategories);
  const searchProducts = useClientProductStore((state) => state.searchProducts);
  const search = useClientProductStore((state) => state.search);
  const categories = useClientCategoryState((state) => state.categories);
  React.useEffect(() => {
    setMounted(true);
    getCategories({});
  }, []);

  const router = useRouter();

  const debouncedSearch = React.useMemo(
    () =>
      debounce((data: z.infer<typeof SearchSchema>) => {
        if (data.search !== "") {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            search: data.search,
            categoryIds: data.category === "-1" ? [] : [Number(data.category)],
          });	
        } else {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            categoryIds: data.category === "-1" ? [] : [Number(data.category)],
          });
        }
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
      router.push(
        "/search" +
          "?" +
          new URLSearchParams({
            category:
              ((data.category ?? "-1") === "-1" ? "" : data.category) ?? "",
            query: data.search ?? "",
          }).toString()
      );
    })();
  };

  if (!mounted) {
    return <Skeleton className="h-12 w-full max-w-lg" />;
  }

  return (
    <Popover open={form.watch("search") !== ""}>
      <PopoverTrigger asChild>
        <Form {...form}>
          <form
            className="flex items-center border border-primary rounded-md p-2 w-full max-w-lg"
            onSubmit={handleSubmit}
          >
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => {
                return (
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className=" text-sm focus-visible:ring-0 rounded-r-none font-medium !border-0 !border-r-2">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent className="top-1">
                      <SelectItem value="-1">Tất cả danh mục</SelectItem>
                      {categories?.data.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />

            <FormField
              name="search"
              control={form.control}
              render={({ field }) => {
                return (
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 border-none focus-visible:ring-0 shadow-none"
                    {...field}
                  />
                );
              }}
            />
            <Button variant="ghost" className="p-2" type="submit">
              <Search className="w-5 h-5 text-gray-500" />
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
          {search?.data.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                router.push("/product/" + item.slug);
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
                Sản phẩm không tồn tại
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
