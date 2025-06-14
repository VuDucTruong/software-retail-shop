"use client";
import BestSellerSection from "@/components/home/BestSellerSection";
import BrandCarousel from "@/components/home/BrandCarousel";
import CategoryCard from "@/components/home/CategoryCard";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import HomeProductSection from "@/components/home/HomeProductSection";
import TopItemsList from "@/components/home/TopItemsList";
import { useClientCategoryState } from "@/stores/cilent/client.category.store";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { useTranslations } from "next-intl";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function HomePage() {
  const t = useTranslations();
  const popularTags = [
    "hoc_tap",
    "giai_tri",
    "lam_viec",
    "steam",
    "office",
    "vpn",
  ];
  const suitablePrices = [
    "20.000",
    "50.000",
    "100.000",
    "200.000",
    "500.000",
    "1.000.000",
  ];

  const categories = useClientCategoryState(state => state.categories);


  const [products, getProducts] = useClientProductStore(
    useShallow((state) => [state.products, state.getProducts])
  );

  useEffect(() => {
    getProducts(
      {
        pageRequest: {
          page: 0,
          size: 8,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      },
      "lastest"
    );
  }, [getProducts]);

  return (
    <div className="flex flex-col gap-4 main-container">
      <div className="flex gap-4">
        <CategoryCard categories={categories}/>
        <div className="flex-1">
          <HomeCarousel />
        </div>
      </div>

      {/* Main content */}
      <BrandCarousel />
      <HomeProductSection
        title={t("latest_products")}
        name="lastest"
        
      />
      <TopItemsList title={t("popular_tags")} items={popularTags} />
      <BestSellerSection />
      <TopItemsList title={t("suitable_prices")} items={suitablePrices} />

      {
        categories && categories.data.length > 0 && (
          categories.data.map((category) => (
            <HomeProductSection
              key={category.id}
              title={category.name}
              categoryId={category.id}
              name={category.name}
            />
          ))
        )
      }
    </div>
  );
}
