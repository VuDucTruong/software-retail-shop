'use client'
import CartForm from "@/components/cart/CartForm";
import {useEffect} from "react";
import {useShallow} from "zustand/shallow";
import {PaymentCallback} from "@/stores/order/payment.store";
import { useSearchParams } from "next/navigation";


export default function PaymentCallbackPage() {
    const searchParams = useSearchParams();
    const [callbackPayment] = PaymentCallback.useStore(useShallow(s => [s.callbackPayment]))

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries()) as Record<string, string>;
        callbackPayment(params)
    }, [callbackPayment, searchParams]);

    return <CartForm onModalYes={() => {
    }} mode='settlement'/>
}