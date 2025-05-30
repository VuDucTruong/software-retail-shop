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

const SearchSchema = z
  .object({
    categoryId: z.string(),
    search: z.string(),
  })
  .partial();

export default function SearchBar() {
  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      categoryId: "all",
      search: "",
    },
  });
  const getCategories = useClientCategoryState((state) => state.getCategories);
  const searchProducts = useClientProductStore((state) => state.searchProducts);
  const search = useClientProductStore((state) => state.search);
  const categories = useClientCategoryState((state) => state.categories);
  React.useEffect(() => {
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
            categoryIds: data.categoryId === "all" ? [] : [Number(data.categoryId)],
          });	
        } else {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            categoryIds: data.categoryId === "all" ? [] : [Number(data.categoryId)],
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

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== "all")
      );

      const searchParams = new URLSearchParams();

      searchParams.set("search", cleanData.search ?? "");
      searchParams.set("categoryId", cleanData.categoryId ?? "");
      searchParams.set("page", "0");
      searchParams.set("sort", "id,asc");

      router.push(`/search?${searchParams.toString()}`);
      
    })();
  };

  if (!categories) {
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
              name="categoryId"
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
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
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
            <Button variant="ghost" className="p-2 hover:bg-primary/80 hover:text-white text-gray-500 cursor-pointer" type="submit">
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
