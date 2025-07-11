"use client";
import ProductItem from "@/components/common/ProductItem";
import { FilterForm } from "@/components/search/FilterForm";

import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import SearchNotFound from "@/components/common/SearchNotFound";
import SearchPagination from "@/components/search/SearchPagination";
import LoadingPage from "@/components/special/LoadingPage";
import { useSearchParams } from "next/navigation";

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
        ([, v]) => v !== undefined && v !== ""
      )
    );

    getProducts(cleanedPayload, "search");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const productList = products.get("search");

  if (!productList) {
    return <div className="main-container">
      <LoadingPage />
    </div>;
  }

  const searchTitle =
    search.length > 0 ? t('search_results_for_x' , {x: search}) : t('search_results');

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
                {...product}
                className="w-full"
              />
            ))}
          </>
        ) : (
          <SearchNotFound className="col-span-4" objectName={t("products")}/>
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
