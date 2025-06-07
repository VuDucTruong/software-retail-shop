"use client";
import ProductItem from "@/components/common/ProductItem";
import { FilterForm } from "@/components/search/FilterForm";

import { Button } from "@/components/ui/button";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { useSearchParams } from "next/navigation";
import LoadingPage from "@/components/special/LoadingPage";
import SearchPagination from "@/components/search/SearchPagination";
import Link from "next/link";
import Image from "next/image";
import SearchNotFound from "@/components/common/SearchNotFound";

export default function SearchResultPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "-1";
  const tag = searchParams.get("tag") || "all";
  const priceFrom = searchParams.get("priceFrom") || "";
  const priceTo = searchParams.get("priceTo") || "";
  const sort = searchParams.get("sort") || "createdAt,desc";
  const page = Number(searchParams.get("page") || "0");

  const [products, getProducts] = useClientProductStore(
    useShallow((state) => [state.products, state.getProducts])
  );

  useEffect(() => {
    const requestPayload = {
      pageRequest: {
        page: Number(page),
        size: 16,
        sortBy: sort.split(",")[0],
        sortDirection: sort.split(",")[1] || "desc",
      },
      search,
      categoryIds: categoryId === "-1" ? [] : [Number(categoryId)],
      tags: tag === "all" ? [] : [tag],
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceTo: priceTo ? Number(priceTo) : undefined,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(requestPayload).filter(
        ([_, v]) => v !== undefined && v !== ""
      )
    );

    getProducts(cleanedPayload, "search");
  }, [searchParams]);
  const productList = products.get("search");

  if (!productList) {
    return <div className="main-container">
      <LoadingPage />
    </div>;
  }

  const searchTitle =
    search.length > 0 ? `Search results for "${search}"` : "Search results";

  return (
    <div className="flex flex-col gap-12 main-container">
      <h2>{searchTitle} </h2>
      <FilterForm />

      <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
        {productList.data.length > 0 ? (
          <>
            {productList.data.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                className="w-full"
              />
            ))}
          </>
        ) : (
          <SearchNotFound className="col-span-4"/>
        )}
      </div>

      {(productList.totalPages ?? 0) > 0 && (
        <SearchPagination
          currentPage={page}
          totalPages={productList.totalPages ?? 0}
        />
      )}
    </div>
  );
}
