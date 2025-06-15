"use client";
import { useTranslations } from "next-intl";
import ProductItem from "@/components/common/ProductItem";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { useEffect } from "react";

type HomeProductSectionProps = {
  title: string;
  categoryId?: number;
  name: string;
};

export default function HomeProductSection(props: HomeProductSectionProps) {
  const t = useTranslations();
  const { title, categoryId,name } = props;

  const products = useClientProductStore(state => state.products.get(name));
  const getProducts = useClientProductStore(state => state.getProducts);
  
  useEffect(() => {
    getProducts(
      {
        pageRequest: {
          page: 0,
          size: 8,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
        categoryIds: categoryId ? [categoryId] : undefined,
      },
      name
    );
  }, [categoryId, name, getProducts]);

  const onMoreClick = () => {
    const searchParams = new URLSearchParams();
      searchParams.set("categoryId", categoryId?.toString() ?? "");
      searchParams.set("page", "0");
      if(name == "lastest") {
        searchParams.set("sort", "createdAt,desc");
      } else {
        searchParams.set("sort", "id,asc");
      }
    window.location.href = `/search?${searchParams.toString()}`;
  };

  if(products?.data.length === 0) {
    return;
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-row justify-between mb-6 items-center">
          <div>
            <h3>{title}</h3>
          </div>
          <Button variant={"link"} onClick={onMoreClick}>{t("see_more")}</Button>
        </div>
        {/* List item */}
        {
          products === undefined ? (<div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {Array.from({length: 8}).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[200px] w-full rounded-sm" />
          ))}
        </div>) : (<div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {products.data.map((item, index) => (
            <ProductItem
              key={index}
              {...item}
            />
          ))}
        </div>)
        }
      </CardContent>
    </Card>
  );
}
