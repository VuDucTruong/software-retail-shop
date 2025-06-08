"use client";

import CartItemsSection from "@/components/cart/CartItemsSection";
import PaymentSection from "@/components/cart/PaymentSection";
import { useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

export default function Page() {
  //const t = useTranslations();
  const stepItems = [
    { name: "Cart", icon: IoCartSharp },
    { name: "Confirm", icon: GiConfirmed },
    { name: "Payment", icon: MdOutlinePayments },
  ];
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 main-container">
      <div className="flex gap-2 px-12">
        {stepItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-center gap-2 not-last:flex-1"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`size-8 rounded-full flex items-center justify-center ${
                    index <= stepIndex ? "bg-primary" : "bg-slate-400"
                  }`}
                >
                  <Icon className={`size-5  text-white`} />
                </div>
                <div
                  className={`${
                    index == stepIndex
                      ? "font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </div>
              </div>
              {index < stepItems.length - 1 && (
                <div className="flex-1 bg-slate-500 h-px"></div>
              )}
            </div>
          );
        })}
      </div>

      {stepIndex == 0 || stepIndex == 1 ? (
        <CartItemsSection
          cartItems={[
            {
              id: 1,
              quantity: 10,
              product: {
                id: 1,
                imageUrl: "/empty_img.png",
                name: "myprod",
                favorite: false,
                quantity: 10,
                originalPrice: 10_000,
                price: 10_000,
                tags: ["abc", "def"],
              },
            },
          ]}
          stepIndex={stepIndex}
          handleNextStep={() => {
            setStepIndex(stepIndex + 1);
          }}
          handlePrevStep={() => setStepIndex(stepIndex - 1)}
        />
      ) : (
        <PaymentSection />
      )}
    </div>
  );
}
