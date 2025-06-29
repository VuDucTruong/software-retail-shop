import React, {ReactNode} from "react";
import {CheckCircle, Clock, XCircle, Mail} from "lucide-react";
import {OrderStatus, PaymentStatus} from "@/api";
import {Card} from "@/components/ui/card";
import {useTranslations} from "next-intl";
import Link from "next/link";


export function OrderCompletedView({children}: { children: ReactNode | null }) {
    const t = useTranslations();
    return (
        <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Payment Successful</h2>
            <p className="text-muted-foreground">{t("order_delivered")}</p>
            {children}
        </>
    )
}

export function OrderPaymentFailureView({children}: { children: ReactNode | null }) {
    const t = useTranslations();
    
    return (
        <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">{t("failed_payment")}</h2>
            <p className="text-muted-foreground">{t("failed_payment")}, {t("please_new")}</p>
            {children}
        </>
    )
}

export function OrderEmailFailedView({children}: { children: ReactNode | null }) {
    const t =useTranslations()
    return (
        <>
            <Mail className="text-red-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">{t("error_send_mail")}</h2>
            <p>
                {t("error_send_mail")}
                <br/>
                <Link href={"/feedback"}>{t("contact_us")}</Link>
            </p>
            {children}
        </>
    )
}

export function OrderOnDeliveryView({children}: { children: ReactNode | null }) {
    const t =useTranslations()
    return (
        <>
            <Clock className="text-yellow-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">{t("please_wait")}</h2>
            <p className="text-muted-foreground">{t("success_payment")}
                <br/>
                {t("preparing_delivery")}</p>
            {children}
        </>
    )
}

export function OrderPaymentInSession({children}: { children: ReactNode | null }) {
    const t =useTranslations()
    return (
        <>
            <Clock className="text-yellow-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">{t("uncompleted_payment")}</h2>
            <p className="text-muted-foreground">{t("please_complete")}...</p>
            {children}
        </>
    )
}

/// NOTE must get Order's payment to display and prevent next step
/// IF payment != null && Pstatus==null || Pstatus==PENDING => DISPLAY loading page (in that card)
/// ==> payment ==null display to route next step
/// SUCCESS thì vân nen route chứ nhỉ?
export function OrderStatusView({ orderStatus, children}: {
    orderStatus: OrderStatus,
    children: ReactNode | null | undefined
}) {
    return (
        <div className="flex items-center justify-center bg-muted">
            <Card className="max-w-lg mx-auto p-6 text-center space-y-4">
                {
                    (() => {
                        if (orderStatus === null || orderStatus === undefined || orderStatus === 'PENDING') {
                            return <OrderPaymentInSession>{children}</OrderPaymentInSession>
                        } else if (orderStatus === 'FAILED') {
                            return <OrderPaymentFailureView>{children}</OrderPaymentFailureView>
                        } else if (orderStatus === 'FAILED_MAIL') {
                            return <OrderEmailFailedView>{children}</OrderEmailFailedView>
                        } else if (orderStatus === 'PROCESSING') {
                            return <OrderOnDeliveryView>{children}</OrderOnDeliveryView>
                        } else if (orderStatus === 'COMPLETED') {
                            return <OrderCompletedView>{children}</OrderCompletedView>
                        }
                        return null;
                    })()
                }
            </Card>
        </div>
    );
}

