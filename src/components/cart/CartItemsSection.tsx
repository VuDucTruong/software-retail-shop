import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import CartItemList from "./CartItemList";
import { Button } from "../ui/button";
import { MdPayment, MdQrCodeScanner } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import EmptyList from "./EmptyList";
import { IoIosArrowBack } from "react-icons/io";
import { Cart } from "@/api";

type CardItemsProps = {
  stepIndex: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  cartItems: Cart[];
};

export default function CartItemsSection(props: CardItemsProps) {
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
      <CardHeader>
        <CardTitle>
          <h3>
            {t("Cart")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ( {props.cartItems.length} {t("product")} )
            </span>
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-8">
        {props.cartItems.length == 0 && <EmptyList />}
        {props.cartItems.length > 0 && (
          <div className="w-full">
            <CartItemList data={props.cartItems} />
          </div>
        )}

        <div className="w-[400px]">
          <Accordion type="multiple" className="w-full">
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
          <div className="w-full flex flex-col gap-2">
            <p className="font-semibold">{t("Payment")}</p>
            {/* Preview value */}
            <TextWithValue
              text={t("total_product_value")}
              value={"1.000.000 VND"}
            />
            <TextWithValue
              text={"Discount 15%"}
              value={"-" + "1.000.000 VND"}
            />
            <div className="w-full h-px bg-border"></div>
            <TextWithValue text={t("total_amount_payable")} value={"0 VND"} />

            {props.stepIndex == 0 && (
              <Button onClick={props.handleNextStep}>
                <MdQrCodeScanner />
                {t("purchase_mobile_banking")}
              </Button>
            )}

            {props.stepIndex == 1 && (
              <>
                <Button onClick={props.handleNextStep}>
                  <MdPayment /> {t("Confirm")}{" "}
                </Button>

                <Button
                  variant={"link"}
                  className="flex items-center justify-end w-full"
                  onClick={props.handleNextStep}
                >
                  <IoIosArrowBack />
                  {t("return_to_cart")}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TextWithValue({ text, value }: { text: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{text}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
