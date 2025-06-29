'use client'
import React, {ReactNode, useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {useTranslations} from "next-intl";
import Image from "next/image";
import {ArrowRight, CheckCircle, Clock, XCircle, Truck} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "../ui/button";
import {PaymentStatus} from "@/api";
import LoadingDiv from "@/components/special/LoadingDiv";

export default function PaymentSection({children}: { children: ReactNode }) {
    const t = useTranslations();
    const paymentDetails = [
        {label: "Amount", value: "xxxxx"},
        {label: "transaction_fee", value: "xxxxx"},
        {label: "total_amount", value: "xxxxx"},
    ];

    const instructionSteps = [
        "VNPAY.instruction_1",
        "VNPAY.instruction_2",
        "VNPAY.instruction_3",
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex gap-1 items-center">
                    <Image src={"/vnpay.png"} width={50} height={50} alt="VNPLAY"/>
                    <h3>{t("payment_vnpay")}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-around border-y border-border py-2">
                    {paymentDetails.map((item, index) => {
                        return (
                            <div key={index} className="font-bold">
                                {t(item.label)} : {item.value}
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-4 items-center justify-center">
                    <div className="size-[250px] bg-amber-300 text-white">QR IMAGE</div>

                    <div className="flex flex-col gap-2 items-start justify-center">
                        <p className="font-bold text-lg">{t("VNPAY.instruction_title")}</p>
                        <ol>
                            {instructionSteps.map((item, index) => {
                                return (
                                    <li key={index} className="my-2 list-inside">
                                        <strong>{t("Step") + ` ${index + 1}: `}</strong> {t(item)}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export const PaymentSuccessOutline = ({children}: { children: ReactNode | null }) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const t = useTranslations()

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [router]);

    return (
        <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Payment Successful</h2>
            {children ||
                <>
                    <p className="text-muted-foreground text-center">
                        {t("success_payment")}
                        <br/>
                        {t("redirecting", { count: countdown })}
                    </p>
                    <Button variant="outline" onClick={() => router.push('/')}>
                        <ArrowRight className="mr-2 h-4 w-4"/> {t("go_home_now")}
                    </Button>
                </>
            }
        </>
    )
};

export const PaymentPendingOutline = ({children}: { children: ReactNode | null }) => {
    const t = useTranslations()

    return (
        <>
            <LoadingDiv title={`${t("please_wait")}`}
                        content={`${t("sys_resolving_order")}, ${t("please_wait")}`}/>
        </>
    );

}
export const PaymentFailedOutline = ({children}: { children: ReactNode | null }) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const t = useTranslations();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [router]);

    return (
        <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">{t("failed_payment")}</h2>
            <>
                <p className="text-muted-foreground">
                    ${t("something_went_wrong")}. {t("redirecting", { count: countdown })}
                </p>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <ArrowRight className="mr-2 h-4 w-4"/> {t("go_home_now")}
                </Button>
            </>
        </>
    );
};


export function PaymentSettlePage({status, children}: {
    status: PaymentStatus,
    children: ReactNode | null | undefined
}) {
    return (
        <div className="flex items-center justify-center bg-muted">
            <Card className="max-w-lg mx-auto p-6 text-center space-y-4">
                {status === 'SUCCESS' && <PaymentSuccessOutline>{children}</PaymentSuccessOutline>}
                {status === 'PENDING' && <PaymentPendingOutline>{children}</PaymentPendingOutline>}
                {status === 'FAILED' && <PaymentFailedOutline>{children}</PaymentFailedOutline>}
            </Card>
        </div>
    );
}