import React from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {convertPriceToVND} from "@/lib/currency_helper";
import {FaRegCopy} from "react-icons/fa6";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../ui/accordion";
import {Input} from "../ui/input";
import {OrderDetail} from "@/api";

type OrderDetailType = {
    orderDetail: OrderDetail
}

export default function OrderDetailItem({orderDetail}: OrderDetailType) {
    const t = useTranslations();
    return (
        <div className="flex gap-4 items-start w-full">
            <div className="relative w-[200px] aspect-[2/1]">
                <Image
                    src={orderDetail.product.imageUrl || "/banner.png"}
                    fill
                    alt="Product image"
                    className="rounded-md"
                />
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex  justify-between items-start">
                    <div>
                        <h4 className="text-lg">Product item</h4>
                        <p className="text-sm text-muted-foreground">Tags</p>
                    </div>

                    <h4 className="text-lg">
                        {t("Quantity")}: {orderDetail.quantity}
                    </h4>

                    <h4 className="text-lg">{convertPriceToVND(orderDetail.price)}</h4>
                </div>

                <Accordion type="multiple" className="w-full bg-accent px-2 rounded-md">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:text-primary text-[16px]">
                            Key
                        </AccordionTrigger>
                        <AccordionContent className="flex py-2">
                            <div
                                className="p-2 bg-primary flex items-center justify-center size-11 text-white hover:opacity-80 rounded-l-md cursor-pointer">
                                <FaRegCopy className="size-full"/>
                            </div>
                            {
                                orderDetail.product.keys.map((k,i)=>(
                                    <Input key={i} value={k} readOnly={true}
                                           className="text-primary w-2/3 bg-white !text-lg h-11 rounded-l-none focus-visible:ring-0"/>
                                ))
                            }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
