import React from "react";
import { Card, CardContent } from "../ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { title } from "process";
import { on } from "events";
import EmptyList from "./EmptyList";
import CartItemList from "./CartItemList";

export default function CartItemsSection() {
  const t = useTranslations();

  const accordionItems = [
    {
      title: "q_have_introduction_code",
      inputPlaceholder: "introduction_code",
      onApply: () => {},
    },
    {
      title: "q_have_discount_code",
      inputPlaceholder: "discount_code",
      onApply: () => {},
    },
    {
      title: "q_give_friend",
      inputPlaceholder: "recipient_email",
      onApply: () => {},
    },
  ];

  return (
    <Card>
      <CardContent className="flex gap-8">
        {/* <EmptyList /> */}
        <div className="w-full">
          <CartItemList />
        </div>
        <Accordion type="multiple" className="w-[400px] ">
          {accordionItems.map((item, index) => {
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="hover:text-primary text-[16px]">
                  {t(item.title)}
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 py-2">
                  <Input placeholder={t(item.inputPlaceholder)} />
                  <Button onClick={item.onApply} variant="outline">
                    {t("Apply")}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
