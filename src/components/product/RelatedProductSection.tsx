import { useTranslations } from "next-intl";
import React from "react";
import ProductItem from "@/components/common/ProductItem";



export default function RelatedProductSection(
 
) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-2">
      <h3>{t("related_products")}</h3>
      {/* List item */}
      <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
        {/* {Array.from({ length: 8 }).map((_, index) => (
          <ProductItem
            key={index}
            className="bg-white"
            title="Product title"
            originalPrice={100000}
            price={80000}
          />
        ))} */}
      </div>
    </div>
  );
}
