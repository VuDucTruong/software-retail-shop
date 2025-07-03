'use client'
import CartForm from "@/components/cart/CartForm";
import {useEffect} from "react";
import {useShallow} from "zustand/shallow";
import {PaymentCallback} from "@/stores/order/payment.store";


export default function PaymentCallbackPage() {
    const params = Object.fromEntries(new URLSearchParams(window.location.search)) as Record<string, string>;
    const [callbackPayment] = PaymentCallback.useStore(useShallow(s => [s.callbackPayment]))

    useEffect(() => {
        callbackPayment(params)
    }, [callbackPayment, params]);

    return <CartForm onModalYes={() => {
    }} mode='settlement'/>
}