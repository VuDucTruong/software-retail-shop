"use client";

import { CartLocal } from "@/stores/order/cart.store";
import { OrderCustomer } from "@/stores/order/order.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

import CartForm from "@/components/cart/CartForm";
import { useTranslations } from "use-intl";
import { useShallow } from "zustand/shallow";

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
