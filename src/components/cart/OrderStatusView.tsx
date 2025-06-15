import React, {ReactNode} from "react";
import {CheckCircle, Clock, XCircle, Mail} from "lucide-react";
import {OrderStatus, PaymentStatus} from "@/api";
import {Card} from "@/components/ui/card";


export function OrderCompletedView({children}: { children: ReactNode | null }) {
    return (
        <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Payment Successful</h2>
            <p className="text-muted-foreground">Yoru order is delivered, please check your email</p>
            {children}
        </>
    )
}

export function OrderPaymentFailureView({children}: { children: ReactNode | null }) {
    return (
        <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Payment Failed</h2>
            <p className="text-muted-foreground">your Payment is failed, please request a new order</p>
            {children}
        </>
    )
}

export function OrderEmailFailedView({children}: { children: ReactNode | null }) {
    return (
        <>
            <Mail className="text-red-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Failure on sending Email</h2>
            <p>
                Having problems sending you email of the order.
                <br/>
                Please contact our at ..link
            </p>
            {children}
        </>
    )
}

export function OrderOnDeliveryView({children}: { children: ReactNode | null }) {
    return (
        <>
            <Clock className="text-yellow-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Waiting for Delivery</h2>
            <p className="text-muted-foreground">Your payment was successful.
                <br/>
                Hang tight, we are preparing your
                delivery.</p>
            {children}
        </>
    )
}

export function OrderPaymentInSession({children}: { children: ReactNode | null }) {
    return (
        <>
            <Clock className="text-yellow-500 w-16 h-16 mx-auto"/>
            <h2 className="text-xl font-bold">Uncompleted payment </h2>
            <p className="text-muted-foreground">Please complete your payment...</p>
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

