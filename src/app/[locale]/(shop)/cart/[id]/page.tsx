'use client'

import React, {useEffect} from 'react';
import {OrderCustomer} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import CartForm from "@/components/cart/CartForm";
import {PaymentSingle} from "@/stores/order/payment.store";
import {useParams, useRouter} from "next/navigation";
import {ApiError} from 'next/dist/server/api-utils';
import {useTranslations} from "next-intl";
import {toast} from "sonner";

function Page() {

    const [getById,] = OrderCustomer.useStore(useShallow(s => [
        s.getBydId,
    ]));
    const [getPaymentUrl, setOrderId,] = PaymentSingle.useStore(useShallow(s =>
        [s.getPaymentUrl, s.setOrderId,]))
    const t = useTranslations();

    const rawOrderId = useParams()?.id;
    const router = useRouter();

    function handleClickToPayment() {
        toast.loading(t("loading_payment_url"))
        getPaymentUrl().then(url => {
            // router.push()
            window.location.href = url
        }).catch(e => {
            /// HELP ME SHOW ERROR HERE
            toast.error(t("error_payment_url"))
            console.error("having paymentUrl error", e);
        })
    }

    useEffect(() => {
        if (rawOrderId) {
            const orderId = Number(rawOrderId);
            if (rawOrderId && !isNaN(orderId)) {
                getById(orderId).then(() => {
                    setOrderId(orderId);
                }).catch(e => {
                    if (e instanceof ApiError)
                    {
                        toast.error(t("error_process_order"))
                        router.push("/cart")
                        return
                    }
                    toast.error(t("INTERNAL.UNKNOWN"))
                })
            } else {
                toast.error(t("API.ORDER_NOT_FOUND"))
                router.push("/cart")
            }
        }
    }, [getById, rawOrderId, router, setOrderId])


    return (
        <CartForm onModalYes={handleClickToPayment}
                  mode='payment'/>
    );
}

export default Page;