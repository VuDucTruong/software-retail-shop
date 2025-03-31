import React from "react";
import Image from "next/image";
import { useFormatter } from "next-intl";
import { Card, CardContent, CardTitle } from "./ui/card";
import DiscountItem from "./DiscountItem";
import { cn } from "@/lib/utils";

type ProductItemProps = {
  title: string;
  originalPrice: number;
  price: number;
  className?: string;
};

export default function ProductItem(props: ProductItemProps) {
  const format = useFormatter();
  const convertedPrice = format.number(props.price, {
    style: "currency",
    currency: "VND",
  });

  const convertedOriginalPrice = format.number(props.originalPrice, {
    style: "currency",
    currency: "VND",
  });

  const discountPercentage = Math.round(
    (props.price * 100) / props.originalPrice
  );

  return (
    <Card className={cn("p-0 gap-2 bg-transparent hover:opacity-80 cursor-pointer", props.className)}>
      <CardTitle>
        <figure className="relative h-[136px]">
          <Image
            className="rounded-sm"
            fill
            src={"/banner.png"}
            alt="Product image"
          />
        </figure>
      </CardTitle>
      <CardContent className="px-2 pb-2">
        <div >{props.title}</div>
        <div className="text-lg font-semibold">{convertedPrice}</div>
        <div className="flex gap-4 items-center">
          <div className="line-through text-gray-400">
            {convertedOriginalPrice}
          </div>
          <DiscountItem discountPercentage={discountPercentage} />
        </div>
      </CardContent>
    </Card>
  );
}
