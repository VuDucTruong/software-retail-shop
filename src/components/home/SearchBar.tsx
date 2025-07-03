import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useClientCategoryState} from "@/stores/cilent/client.category.store";
import {useClientProductStore} from "@/stores/cilent/client.product.store";
import debounce from "lodash/debounce";
import {PackageSearch, Search} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Form, FormField} from "../ui/form";
import {Skeleton} from "../ui/skeleton";

type SearchForm = {
  categoryId?: string;
  search?: string;
};

export default function SearchBar() {
  const form = useForm<SearchForm>({
    defaultValues: {
      categoryId: "all",
      search: "",
    },
  });
  const getCategories = useClientCategoryState((state) => state.getCategories);
  const categories = useClientCategoryState((state) => state.categories);
  const searchProducts = useClientProductStore((state) => state.searchProducts);
  const search = useClientProductStore((state) => state.search);

  React.useEffect(() => {
    getCategories({});
  }, [getCategories]);

  const router = useRouter();
  const t = useTranslations();

  const debouncedSearch = React.useMemo(
    () =>
      debounce((data: SearchForm) => {
        if (data.search !== "") {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            search: data.search,
            categoryIds:
              data.categoryId === "all" ? [] : [Number(data.categoryId)],
          });
        } else {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            categoryIds:
              data.categoryId === "all" ? [] : [Number(data.categoryId)],
          });
        }
      }, 400),
    [searchProducts]
  );

  useEffect(() => {
    const subscription = form.watch((data) => {
      debouncedSearch(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit((data) => {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== "" && value !== "all"
        )
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
    <Popover
      onOpenChange={(open) => {
        if (open && search === null) {
          searchProducts({
            pageRequest: {
              page: 0,
              size: 10,
              sortBy: "createdAt",
              sortDirection: "desc",
            },
            search: "",
            categoryIds: [],
          });
        }
      }}
    >
      <PopoverTrigger className="w-full max-w-lg" asChild>
        <div>
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
                        <SelectValue placeholder={t("Category")} />
                      </SelectTrigger>
                      <SelectContent className="top-1">
                        <SelectItem value="all">
                          {t("all_categories")}
                        </SelectItem>
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
                      placeholder={t("search_hint")}
                      className="flex-1 border-none focus-visible:ring-0 shadow-none"
                      {...field}
                    />
                  );
                }}
              />
              <Button
                variant="ghost"
                className="p-2 hover:bg-primary/80 hover:text-white text-gray-500 cursor-pointer"
                type="submit"
              >
                <Search className="w-5 h-5 " />
              </Button>
            </form>
          </Form>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-lg"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col  gap-3 ">
          {search === null && (
                      <div className="flex items-center justify-center h-full w-full">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-blue-500"></div>
            </div>
          )}



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
                {t("no_matching_x", { x: t("products") })}
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
