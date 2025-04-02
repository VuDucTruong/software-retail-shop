import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";
import { Card, CardContent } from "../ui/card";
import QuantityCounter from "./QuantityCounter";
import DiscountItem from "../DiscountItem";
import { BsBox2 } from "react-icons/bs";
import { useFormatter, useTranslations } from "next-intl";
import { calcDiscountPercentage, convertPriceToVND } from "@/lib/currency_helper";
import { CartItemProps } from "@/types/cart_item";





export default function CartItem(data: CartItemProps) {
  const { id,title, tags, quantity, price, image, isAvailable, originalPrice, status, onDelete } = data;
  const format = useFormatter();
  const discountPercentage = calcDiscountPercentage(price, originalPrice);
    const t = useTranslations();
  return (
    <Card className="p-0">
      <CardContent className="flex gap-4 p-4">
        <div className="relative w-[270px] aspect-video">
          <Image
            alt="product"
            src={image}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1 flex-row justify-between">
            <div>
              <h4>{title}</h4>
              <div className="text-muted-foreground">{tags.join(', ')}</div>
            </div>
            <QuantityCounter quantity={quantity} />
            <div className="flex flex-col items-end">
              <h4>{convertPriceToVND(price,format)}</h4>
              <div className="flex gap-2 items-center">
                <DiscountItem discountPercentage={discountPercentage} />
                <div className="font-medium text-muted-foreground line-through">
                  {convertPriceToVND(originalPrice,format)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <div className="flex items-center gap-2">
                <BsBox2 />
                <div>{t('Status')}: </div>
                <div className={`${isAvailable ? "text-green-400": "text-red-500"}`}>{isAvailable ? t('in_stock') : t('out_of_stock')}</div>
            </div>
            <Button onClick={()=>onDelete(id)} variant="destructive">
              <MdDelete />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
