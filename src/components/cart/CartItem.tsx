import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";
import { Card, CardContent } from "../ui/card";
import QuantityCounter from "./QuantityCounter";
import { BsBox2 } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { CartItemProps } from "@/types/cart_item";
import CommonPriceItem from "@/components/common/CommonPriceItem";





export default function CartItem(data: CartItemProps) {
  const { id,title, tags, quantity, price, image, isAvailable, originalPrice, status, onDelete } = data;
    const t = useTranslations();
  return (
    <Card className="p-0">
      <CardContent className="flex gap-4 p-4">
        <div className="relative w-[270px] aspect-[2/1]">
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
            <CommonPriceItem price={price} originalPrice={originalPrice} />
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
