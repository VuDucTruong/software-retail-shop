import React from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DiscountItem from "./DiscountItem";
import { cn } from "@/lib/utils";
import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import { useRouter } from "@/i18n/navigation";

type ProductItemProps = {
  title: string;
  originalPrice: number;
  price: number;
  className?: string;
};

export default function ProductItem(props: ProductItemProps) {
  const convertedPrice = convertPriceToVND(props.price);

  const convertedOriginalPrice = convertPriceToVND(props.originalPrice);

  const discountPercentage = calcDiscountPercentage(
    props.price,
    props.originalPrice
  );
  const router = useRouter();
  const handleClick = () => {
    router.push("/product/" + props.title);
  };
  return (
    <Card
    onClick={handleClick}
      className={cn(
        "p-0 gap-2 bg-transparent hover:opacity-80 cursor-pointer",
        props.className
      )}
    >
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
        <div>{props.title}</div>
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
