'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BlogMany } from "@/stores/blog/blog.store";
import { useShallow } from "zustand/shallow";
import { StringUtils } from "@/lib/utils";
import { Form, FormField } from "@/components/ui/form";

type SearchParam = {
  search: string;
  g2s: number[];
  page: number;
};

export default function BlogSearchBarOnSearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const [searchBlogs, proxyLoading] = BlogMany.useStoreLight(useShallow((s) => [
    s.getBlogs,
    s.proxyLoading,
  ]));

  const form = useForm<Omit<SearchParam, 'page'>>({
    defaultValues: {
      search: "",
      g2s: [],
    },
  });

  const debouncedSearch = React.useMemo(
    () =>
      debounce((data: SearchParam) => {
        proxyLoading(() =>
            searchBlogs({
              pageRequest: {
                page: data.page,
                size: 8,
                sortBy: "createdAt",
                sortDirection: "desc",
              },
              search: data.search,
              genreIds: data.g2s,
            }),
          'get');
      }, 500),
    []
  );

  useEffect(() => {
    const qSearch = params.get("search") ?? "";
    const qG2s = params.get("g2s")?.split(",").map(Number).filter((n) => n > 0) ?? [];
    const qPage = StringUtils.isNum(params.get("page")) ? Number(params.get("page")) : 0;

    form.setValue("search", qSearch);
    form.setValue("g2s", qG2s);

    debouncedSearch({
      search: qSearch,
      g2s: qG2s,
      page: qPage,
    });
  }, [params]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      const searchParams = new URLSearchParams();

      if (data.search) searchParams.set("search", data.search);
      if (data.g2s?.length) searchParams.set("g2s", data.g2s.join(","));
      searchParams.set("page", "0");

      router.push(`/blog/search?${searchParams.toString()}`);
    })();
  };

  return (
    <Form {...form}>
      <form
        className="flex items-center w-full max-w-md border-b rounded-md border-border shadow-sm"
        onSubmit={handleSubmit}>
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <Input
              placeholder={t("search_hint")}
              className="flex-1 border-none focus-visible:ring-0 shadow-none"
              {...field}
            />
          )}
        />
        <Button
          variant="ghost"
          className="p-2 hover:bg-accent/80 text-gray-500 cursor-pointer"
          type="submit">
          <Search className="w-5 h-5" />
        </Button>
      </form>
    </Form>
  );
}
