import CommonPriceItem from "@/components/common/CommonPriceItem";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { BsBox2 } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import QuantityCounter from "./QuantityCounter";


export type CartItemDataType = {
  id: number,
  product: {
    id: number,
    name: string,
    imageUrl: string,
    quantity: number,
    price: number,
    originalPrice: number,
    favorite: boolean,
    tags: string[],
    /// WILL BE DESCRIPTION LINKS as well
  },
  quantity: number,
}

export default function CartItem(data: CartItemDataType) {
  const {id , product , quantity} = data;

  const quantityRef = React.useRef(quantity);

    const t = useTranslations();

  const isAvailable = product.quantity > 0;

  const handleDeleteCartItem = () => {
    console.log("Delete cart item with id:", id);
  }
  return (
    <Card className="p-0">
      <CardContent className="flex gap-4 p-4">
        <div className="relative w-[270px] aspect-[2/1]">
          <Image
            alt="product"
            src={product.imageUrl ?? "/empty_img.png"}
            fill
            sizes="100%"
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1 flex-row justify-between">
            <div>
              <h4>{product.name}</h4>
              <div className="text-muted-foreground">{product.tags.join(', ')}</div>
            </div>
            <QuantityCounter quantity={quantityRef} />
            <CommonPriceItem price={product.price} originalPrice={product.originalPrice} />
          </div>
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <div className="flex items-center gap-2">
                <BsBox2 />
                <div>{t('Status')}: </div>
                <div className={`${isAvailable ? "text-green-400": "text-red-500"}`}>{isAvailable ? t('in_stock') : t('out_of_stock')}</div>
            </div>
            <Button onClick={handleDeleteCartItem} variant="destructive">
              <MdDelete />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
