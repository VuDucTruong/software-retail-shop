import React from 'react';
import CartItemsSection from "@/components/cart/CartItemsSection";
import {IoCartSharp} from "react-icons/io5";
import {GiConfirmed} from "react-icons/gi";
import {MdOutlinePayments} from "react-icons/md";
import {IconType} from "react-icons/lib";
import {PaymentCallback} from "@/stores/order/payment.store";
import {useShallow} from "zustand/shallow";
import {PaymentSettlePage} from "@/components/cart/PaymentSection";
import {useTranslations} from 'next-intl';

type StepKeyType = "preview" | "payment" | "settlement"

type StepsType = Record<StepKeyType, {
    stepIndex: number,
    title: string,
    icon: IconType
}>

const steps: StepsType = {
    "preview": {
        stepIndex: 0,
        title: "Cart",
        icon: IoCartSharp,
    },
    "payment": {
        stepIndex: 1,
        title: "select_payment_method",
        icon: GiConfirmed,
    },
    "settlement": {
        stepIndex: 2,
        title: "payment",
        icon: MdOutlinePayments,
    }
}
export type CartFormType = {
    onModalYes: () => void,
    mode: StepKeyType,
}

export default function CartForm({onModalYes, mode}: CartFormType) {
    const t = useTranslations();
    const currentStep = steps[mode];
    const [status] = PaymentCallback.useStore(useShallow(s => [
        s.status,
    ]))

    return (
        <div className="flex flex-col gap-4 main-container">
            <div className="flex gap-2 px-12">
                {Object.entries(steps).map(([, {stepIndex, title, icon}], ) => {
                    const Icon = icon;
                    const currentIndex = currentStep.stepIndex;
                    return (
                        <div
                            key={stepIndex}
                            className="flex items-center justify-center gap-2 not-last:flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`size-8 rounded-full flex items-center justify-center ${currentIndex >= stepIndex ? "bg-primary" : "bg-slate-400"}`}>
                                    <Icon className={`size-5  text-white`}/>
                                </div>
                                <div
                                    className={`${currentIndex == stepIndex ? "font-semibold" : "text-muted-foreground"}`}>{t(title)}
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-500 h-px"></div>
                        </div>
                    );
                })}
            </div>
            {
                (() => {
                    if (mode === 'settlement')
                        return <PaymentSettlePage status={status}>{null}</PaymentSettlePage>
                    else
                        return <CartItemsSection
                            mode={mode}
                            handleNextStep={() => onModalYes()}
                            handlePrevStep={() => {
                            }}
                        />
                })()
            }


        </div>
    );
}

