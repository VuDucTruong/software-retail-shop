"use client";

import CartItemsSection from "@/components/cart/CartItemsSection";
import PaymentSection from "@/components/cart/PaymentSection";
import { usePathname } from "@/i18n/navigation";
import { CartLocal } from "@/stores/order/cart.store";
import { OrderCustomer } from "@/stores/order/order.store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

import { useTranslations } from "use-intl";
import { useShallow } from "zustand/shallow";
import CartForm from "@/components/cart/CartForm";
import { OrderCreateRequest, OrderDetailRequest, PaymentUrlRequest } from "@/api";

const stepItems = [
    { name: "Checking out", icon: IoCartSharp },
    { name: "Payment", icon: MdOutlinePayments },
    { name: "On Processing", icon: GiConfirmed },
];

export default function Page() {
    const t = useTranslations();

    const [initialize, createOrder,] = OrderCustomer.useStore(useShallow(s => [
        s.initialize, s.createOrder,
    ]))
    const [orderDetailsMeta, loadMeta, clearItems] = CartLocal.useStore(useShallow(c => [
        c.orderDetailsMeta, c.load, c.clearItems
    ]));


    useEffect(() => {
        if (orderDetailsMeta) {
            initialize(orderDetailsMeta)
        }
    }, [initialize, orderDetailsMeta])

    useEffect(() => {
        if (loadMeta)
            loadMeta()
    }, [loadMeta])

    const router = useRouter();

    function handleClickToPayment() {

        // const request: OrderCreateRequest = {
        //     couponCode: coupon?.code,
        //     orderDetails: orderDetails.map(od=>({
        //         productId: od.productId,
        //         quantity: od.quantity
        //     })),
        //     requestInfo: {
        //         "email": "21522458@gm.uit.edu.vn"
        //     }
        // }
        // console.log(request);
        createOrder().then(orderId => {
            if (orderId) {
                clearItems(true);
                router.push(`/cart/${orderId}`)
            }
        }).catch(e => {
            if (e instanceof Error) {
                const err = e as Error;
                window.alert(e.message);
            }
        })
        /// CREATE ORDER HERE
    }


    return (
        <CartForm onModalYes={handleClickToPayment}
            mode='preview' />
    );
}
