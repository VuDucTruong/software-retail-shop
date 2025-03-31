"use client";
import BestSellerSection from "@/components/home/BestSellerSection";
import BrandCarousel from "@/components/home/BrandCarousel";
import CategoryCard from "@/components/home/CategoryCard";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import HomeProductSection from "@/components/home/HomeProductSection";
import TopItemsList from "@/components/home/PopularTagCard";
import { useTranslations } from "next-intl";

import React from "react";

export default function HomePage() {
  const t = useTranslations();
  const popularTags = [
    "hoc_tap",
    "giai_tri",
    "lam_viec",
    "steam",
    "youtube",
    "open_api",
  ];
  const suitablePrices = [
    "20.000",
    "50.000",
    "100.000",
    "200.000",
    "500.000",
    "1.000.000",
  ]
  return (
    <div className="flex flex-col gap-4 main-container">
      <div className="flex gap-4">
        <CategoryCard />
        <div className="flex-1">
          <HomeCarousel />
        </div>
      </div>

      {/* Main content */}

      <BrandCarousel />
      <HomeProductSection
        title={t("popular_products")}
        onMoreClick={() => {}}
      />
      <TopItemsList title={t('popular_tags')} items={popularTags}/>
      <BestSellerSection />
      <TopItemsList title={t('suitable_prices')} items={suitablePrices}/>

    </div>
  );
}
