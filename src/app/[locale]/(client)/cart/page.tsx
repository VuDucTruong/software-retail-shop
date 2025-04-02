"use client";

import CartItemsSection from "@/components/cart/CartItemsSection";
import PaymentSection from "@/components/cart/PaymentSection";
import { CartItemProps } from "@/types/cart_item";
import { useRef, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

import { useTranslations } from "use-intl";
export default function Page() {
  const t = useTranslations();
  const stepItems = [
    { name: "Cart", icon: IoCartSharp },
    { name: "Confirm", icon: GiConfirmed },
    { name: "Payment", icon: MdOutlinePayments },
  ];
  const productItems:CartItemProps[] = [
    {
        id: 0,
        title: "Product 1",
        tags: ["tag1", "tag2"],
        image: "/banner.png",
        isAvailable: true,
        price: 100,
        originalPrice: 120,
        quantity: useRef(1),
        status: "in_stock",
        onDelete: (id: number) => {
            console.log(productItems[id].quantity)
        },
    },
    {
        id: 1,
        title: "Product 2",
        tags: ["tag3", "tag4"],
        image: "/banner.png",
        isAvailable: false,
        price: 200,
        originalPrice: 250,
        quantity: useRef(1),
        status: "in_stock",
        onDelete: (id: number) => {
            console.log(productItems[id].quantity)
        },
    },
    {
        id: 2,
        title: "Product 3",
        tags: ["tag5", "tag6"],
        image: "/banner.png",
        isAvailable: true,
        price: 150,
        originalPrice: 180,
        quantity: useRef(1),
        status: "out_of_stock",
        onDelete: (id: number) => {
            console.log(productItems[id].quantity)
        },
    },
]
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
                <div className={`size-8 rounded-full flex items-center justify-center ${index <= stepIndex ? "bg-primary" : "bg-slate-400"}`}>
                  <Icon className={`size-5  text-white`} />
                </div>
                <div className={`${index == stepIndex ? "font-semibold" : "text-muted-foreground"}`}>{item.name}</div>
              </div>
              {index < stepItems.length - 1 && (
                <div className="flex-1 bg-slate-500 h-px"></div>
              )}
            </div>
          );
        })}
      </div>

      {
        stepIndex == 0 || stepIndex == 1 ? <CartItemsSection cartItems={productItems} stepIndex={stepIndex} handleNextStep={()=>{
          setStepIndex(stepIndex + 1)
        }} handlePrevStep={()=>setStepIndex(stepIndex - 1)}/> : <PaymentSection/>
      }
      
    </div>
  );
}
