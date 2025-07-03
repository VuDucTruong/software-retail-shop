import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { convertPriceToVND } from "@/lib/currency_helper";
import { FaRegCopy } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { OrderDetail } from "@/api";
import { Button } from "../ui/button";
import { toast } from "sonner";

type OrderDetailType = {
  orderDetail: OrderDetail;
};

export default function OrderDetailItem({ orderDetail }: OrderDetailType) {
  const t = useTranslations();

    const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        toast.success(t("Copied"));
      })
      .catch(() => {
        toast.error(t('failed_to_copy'));
      });
    }

  return (
    <div className="flex flex-col gap-4 rounded-md shadow-md">
      <div className="flex gap-4 items-start w-full">
        <div className="relative w-[200px] aspect-[2/1]">
          <Image
            src={orderDetail.product.imageUrl || "/empty_img.png"}
            fill
            alt="Product image"
            className="rounded-md"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <h4 className="text-lg">
            {orderDetail.product.name} x {orderDetail.quantity}
          </h4>
          <h4 className="text-lg">
            {t("Total")}: {convertPriceToVND(orderDetail.price)}
          </h4>
        </div>
      </div>

      <Accordion type="multiple" className="w-full bg-accent px-2 rounded-md">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:text-primary text-[16px]">
            {t("Product_key")}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {orderDetail.product.keys.map((k, i) => (
              <div className="flex items-center w-full h-11" key={i}>
                {/* <div className="p-2 bg-primary flex items-center justify-center size-11 text-white hover:opacity-80 rounded-l-md cursor-pointer">
                  <FaRegCopy className="size-full" />
                </div> */}

                <Button variant={'outline'} className="h-full aspect-square rounded-r-none" onClick={() => handleCopyKey(k)}>
                    <FaRegCopy />
                </Button>
                <div
                  className="text-primary flex items-center px-2 bg-white h-full border border-border text-lg rounded-l-none rounded-r-md w-full"
                >
                    {k}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
