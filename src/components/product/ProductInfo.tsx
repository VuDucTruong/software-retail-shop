
import { Product } from "@/api";
import CommonSwapIcon from "@/components/common/CommonSwapIcon";
import DiscountItem from "@/components/common/DiscountItem";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { FaBarcode, FaBell } from "react-icons/fa";
import { CiShoppingTag } from "react-icons/ci";

import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import { cn } from "@/lib/utils";
import { useClientFavouriteStore } from "@/stores/cilent/client.favourite.store";
import { FaCartPlus, FaHeart, FaRegCreditCard } from "react-icons/fa6";
import { Button } from "../ui/button";

import { CartLocal } from "@/stores/order/cart.store";
import { useShallow } from "zustand/shallow";
import { GiCancel } from "react-icons/gi";


type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations();
  const router = useRouter();
  const discountPercentage = calcDiscountPercentage(
    product.price,
    product.originalPrice
  );
  const [addedToCart, setAddedToCart] = useState<boolean>(false)
  const [setItem, removeItem, cartItems] = CartLocal.useStore(useShallow(s => [
    s.setItem, s.removeItem, s.orderDetailsMeta
  ]))

  function addToCart() {
    if (addedToCart)
      return;
    setItem(`${product.id}`, {
      name: product.name,
      qty: 1
    })
    setAddedToCart(true);
  }
  function removeFromCart() {
    if (!addedToCart)
      return;
    removeItem(`${product.id}`);
    setAddedToCart(false);
  }

  const updateProductFavourite = useClientFavouriteStore(
    (state) => state.updateProductFavourite);

  return (
    <div className="bg-white">
      <div className="main-container flex gap-10">
        <div className="relative w-[450px] aspect-[2/1] h-fit">
          <Image
            alt="Product image"
            src={product.imageUrl}
            className="rounded-md object-contain"
            sizes="100%"
            fill
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-1/2">
          <div>{t("Product")}</div>
          <h3>{product.name}</h3>

          {/* Tags */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <BsBoxSeam />
              <div>
                {t("Status")}
                {" : "}
                <span className={cn("font-semibold", product.quantity > 0 ? "text-green-500" : "text-red-500")}>
                  {product.quantity > 0 ? t("in_stock") : t("out_of_stock")}
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <FaBarcode />
              <div>
                {t("product_code")}
                {" : "}
                <span className="font-semibold">{product.slug}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <CiShoppingTag />
              <div>
                {t("Tag")}
                {" : "}
                <span className="text-muted-foreground italic">{product.tags.join(",")}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <h4>{convertPriceToVND(product.price)}</h4>
              <CommonSwapIcon
                Icon={FaBell}
                activeColor="text-primary"
                inactiveColor="text-gray-400"
                activeMessage={t("notification_on_message")}
                inactiveMessage={t("notification_off_message")}
              />
              <CommonSwapIcon
                onStatusChange={(isActive) => updateProductFavourite(product.id, isActive)}
                defaultValue={product.favorite}
                Icon={FaHeart}
                activeColor=" text-red-500"
                inactiveColor="text-gray-400"
                activeMessage={t("favorite_message")}
                inactiveMessage={t("unfavorite_message")}
              />
            </div>

            {discountPercentage > 0 && (
              <div className="flex gap-4 items-center">
                <p className="font-medium line-through text-muted-foreground">
                  {convertPriceToVND(product.originalPrice)}
                </p>
                <DiscountItem discountPercentage={discountPercentage} />
              </div>
            )}
          </div>

          {/* Variant */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-col gap-4 py-4 border-y border-border">
              <p className="font-semibold">{t("similar_products")}</p>
              <div className="flex gap-2 flex-row flex-wrap">
                {product.variants?.map((variant, index) => (
                  <Button
                    variant={"outline"}
                    key={index}
                    onClick={() => {
                      if (variant.slug === product.slug) return;
                      router.replace("/product/" + variant.slug);
                    }}
                    className={product.slug === variant.slug ? "bg-primary text-white" : ""}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Buy */}

          <div className="flex gap-4">
            <Button className="w-1/2" disabled={product.quantity <= 0}>
              <FaRegCreditCard />
              {t("buy_now")}
            </Button>

            <Button onClick={addToCart} variant={"outline"} className="w-1/2" disabled={product.quantity <= 0}>
              <FaCartPlus />
              {t("add_to_cart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
