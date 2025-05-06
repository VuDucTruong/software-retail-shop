import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { BsBoxSeam } from "react-icons/bs";
import { FaBarcode, FaBell } from "react-icons/fa";
import { CiShoppingTag } from "react-icons/ci";
import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import { FaCartPlus, FaHeart, FaRegCreditCard } from "react-icons/fa6";
import DiscountItem from "@/components/common/DiscountItem";
import { Button } from "../ui/button";
import CommonSwapIcon from "@/components/common/CommonSwapIcon";

export default function ProductInfo() {
  const t = useTranslations();
  const format = useFormatter();
  const discountPercentage = calcDiscountPercentage(80000, 100000);
  return (
    <div className="bg-white">
      <div className="main-container flex gap-10">
        <div className="relative w-[450px] aspect-[2/1] h-fit">
          <Image
            alt="Product image"
            src={"/banner.png"}
            className="rounded-md object-cover"
            fill
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-1/2">
          <div>{t("Product")}</div>
          <h3>Product Name</h3>

          {/* Tags */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <BsBoxSeam />
              <div>
                {t("Status")}{" : "}<span>{t("in_stock")}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <FaBarcode />
              <div>
              {t("product_code")}{" : "}<span className="font-semibold">{"windowasd123"}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <CiShoppingTag />
              <div>
                {t('Tag')}{" : "}<span>{t("in_stock")}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <h4>{convertPriceToVND(100000)}</h4>
              <CommonSwapIcon Icon={FaBell} activeColor="text-primary" inactiveColor="text-gray-400" activeMessage={t('notification_on_message')} inactiveMessage={t('notification_off_message')}/>
              <CommonSwapIcon Icon={FaHeart} activeColor=" text-red-500" inactiveColor="text-gray-400" activeMessage={t('favorite_message')} inactiveMessage={t('unfavorite_message')}/>
            </div>

            <div className="flex gap-4 items-center">
              <p className="font-medium line-through text-muted-foreground">{convertPriceToVND(80000)}</p>
              <DiscountItem discountPercentage={discountPercentage} />
            </div>
          </div>

          {/* Variant */}
          <div className="flex flex-col gap-4 py-4 border-y border-border">
            <p className="font-semibold">{t("similar_products")}</p>
            <div className="flex gap-2 flex-row flex-wrap">
              {Array.from({ length: 10 }).map((_, index) => (
                <Button variant={'outline'} key={index}>
                    Win 10 pro
              </Button>
              ))}
            </div>
          </div>

          {/* Buy */}

          <div className="flex gap-4">
            <Button className="w-1/2">
              <FaRegCreditCard />
              {t("buy_now")}
            </Button>

            <Button variant={"outline"} className="w-1/2">
              <FaCartPlus />
              {t("add_to_cart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
