import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { IoMdTrendingUp } from "react-icons/io";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import ProductItem from "../ProductItem";
export default function BestSellerSection() {
  const t = useTranslations();
  return (
    <div className="bg-[#000d21] rounded-md flex flex-col gap-4">
      <div className="relative w-full h-[200px] ">
        <Image
          alt="Best seller background"
          className="rounded-md"
          fill
          src={"/best_seller.png"}
        />
      </div>
      <div className="flex flex-col gap-4 py-4 px-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center justify-center rounded-2xl px-8 py-2 border border-white">
            <IoMdTrendingUp className="size-8 text-red-500" />
            <h3 className="text-white">#{t("best_selling_products")}</h3>
          </div>
          <Button variant="link" className="text-white">
            {t("see_more")}
          </Button>
        </div>
        <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductItem
            className=" text-white border-slate-400 border-t-0"
              key={index}
              title="Product title"
              originalPrice={100000}
              price={80000}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
