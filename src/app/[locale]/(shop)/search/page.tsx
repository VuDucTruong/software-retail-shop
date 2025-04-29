import ProductItem from "@/components/common/ProductItem";
import { FilterForm } from "@/components/search/FilterForm";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";
import { IoFilter } from "react-icons/io5";
import { LuListRestart } from "react-icons/lu";
export default function SearchResultPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 main-container">
      <h2>{t("search_products")}</h2>
      <FilterForm />

      <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductItem
            key={index}
            title="Product title"
            originalPrice={100000}
            price={80000}
          />
        ))}
      </div>

      <Button variant={"link"}>{t("see_more")}</Button>
    </div>
  );
}
