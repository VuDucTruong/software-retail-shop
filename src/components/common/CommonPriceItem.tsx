import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import { useFormatter } from "next-intl";
import React from "react";
import DiscountItem from "./DiscountItem";

type Props = {
  price: number;
  originalPrice: number;
};

export default function CommonPriceItem({ price, originalPrice }: Props) {
  const format = useFormatter();
  const discountPercentage = calcDiscountPercentage(price, originalPrice);
  return (
    <div className="flex flex-col items-end gap-2">
      <h4>{convertPriceToVND(price)}</h4>
      <div className="flex gap-2 items-center">
        <DiscountItem discountPercentage={discountPercentage} />
        <div className="font-medium text-muted-foreground line-through">
          {convertPriceToVND(originalPrice)}
        </div>
      </div>
    </div>
  );
}
