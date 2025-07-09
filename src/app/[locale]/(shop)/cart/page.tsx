"use client";

import {CartLocal} from "@/stores/order/cart.store";
import {OrderCustomer} from "@/stores/order/order.store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

import CartForm from "@/components/cart/CartForm";
import {useTranslations} from "next-intl";
import {useShallow} from "zustand/shallow";
import {toast} from "sonner";


export default function Page() {
    const t = useTranslations();

    const [initialize, createOrder,] = OrderCustomer.useStore(useShallow(s => [
         s.initialize, s.createOrder,
    ]))
    const [orderDetailsMeta, loadMeta, clearItems] = CartLocal.useStore(useShallow(c => [
        c.orderDetailsMeta, c.load, c.clearItems
    ]));


    useEffect(() => {
        if (loadMeta)
            loadMeta()
    }, [])
    useEffect(() => {
        if (orderDetailsMeta) {
            initialize(orderDetailsMeta)
        }
    }, [orderDetailsMeta]);


    const router = useRouter();

    function handleClickToPayment() {
        createOrder().then(orderId => {
            if (orderId) {
                clearItems();
                router.push(`/cart/${orderId}`)
            }
        }).catch(e => {
            if (e instanceof Error) {
                toast.error(t("error_create_order"))
            }
        })
        /// CREATE ORDER HERE
    }


    return (
        <CartForm onModalYes={handleClickToPayment}
                  mode='preview'/>
    );
}
