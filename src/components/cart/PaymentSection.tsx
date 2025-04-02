import React from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function PaymentSection() {
  const t = useTranslations();

  const paymentDetails = [
    { label: "Amount", value: "xxxxx" },
    { label: "transaction_fee", value: "xxxxx" },
    { label: "total_amount", value: "xxxxx" },
  ];

  const instructionSteps = [
    "VNPAY.instruction_1",
    "VNPAY.instruction_2",
    "VNPAY.instruction_3",
  ]


  return (
    <Card>
      <CardTitle className="flex gap-1 items-center">
        <Image src={"/vnpay.png"} width={50} height={50} alt="VNPLAY" />
        <h3>{t("payment_vnpay")}</h3>
      </CardTitle>
      <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-around border-y border-border py-2">
            {paymentDetails.map((item, index) => {
              return (
                <div key={index} className="font-bold">
                  {t(item.label)} : {item.value}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 items-center justify-center">
            <div className="size-[250px] bg-amber-300 text-white">
                QR IMAGE
            </div>

            <div className="flex flex-col gap-2 items-start justify-center">
                <p className="font-bold text-lg">{t('VNPAY.instruction_title')}</p>
                <ol>
                    {
                        instructionSteps.map((item, index) => {
                            return (
                            <li key={index} className="my-2 list-inside">
                                <strong>{t('Step') + ` ${index + 1}: `}</strong> {t(item)}
                            </li>
                            );
                        })
                    }
                </ol>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
