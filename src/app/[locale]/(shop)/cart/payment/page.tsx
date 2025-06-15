'use client'
import CartForm from "@/components/cart/CartForm";
import {useTranslations} from "use-intl";
import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {ApiError} from "next/dist/server/api-utils";
import {OrderCustomer} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {PaymentCallback} from "@/stores/order/payment.store";


export default function PaymentCallbackPage() {
    const t = useTranslations();
    const params = Object.fromEntries(new URLSearchParams(window.location.search)) as Record<string, string>;
    const [callbackPayment] = PaymentCallback.useStore(useShallow(s => [s.callbackPayment]))

    useEffect(() => {
        callbackPayment(params)
    }, [callbackPayment, params]);

    return <CartForm onModalYes={() => {
    }} mode='settlement'/>
}