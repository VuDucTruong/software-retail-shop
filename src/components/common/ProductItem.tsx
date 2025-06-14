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
import { Product } from "@/api";

type ProductItemProps = {
  price: number;
  originalPrice: number;
  slug: string;
  imageUrl: string;
  name: string;
  className?: string;
};

export default function ProductItem(props: ProductItemProps) {
  const { price , originalPrice , imageUrl, name ,slug  } = props;
  const convertedPrice = convertPriceToVND(price);

  const convertedOriginalPrice = convertPriceToVND(originalPrice);

  const discountPercentage = calcDiscountPercentage(
    price,
    originalPrice
  );
  const router = useRouter();
  const handleClick = () => {
    router.push("/product/" + slug);
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
        <figure className="relative aspect-video">
          <Image
            className={
              imageUrl === "/empty_img.png"
                ? "object-contain"
                : "object-conver"
            }
            fill
            sizes="100%"
            src={imageUrl}
            alt="Product image"
          />
        </figure>
      </CardTitle>
      <CardContent className="px-2 pb-2 flex h-full flex-col">
        <div>{name}</div>
        <div className="text-lg font-semibold flex-1 flex flex-col justify-center">{convertedPrice}</div>
        {discountPercentage > 0 && (
          <div className="flex gap-4 items-center">
            <div className="line-through text-gray-400">
              {convertedOriginalPrice}
            </div>
            <DiscountItem discountPercentage={discountPercentage} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
