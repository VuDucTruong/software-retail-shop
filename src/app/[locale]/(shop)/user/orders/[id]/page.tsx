"use client";

import OrderDetailItem from "@/components/orders/OrderDetailItem";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {useTranslations} from "next-intl";
import {useParams} from "next/navigation";
import {FaCartPlus} from "react-icons/fa";
import {format} from "date-fns";
import {convertPaymentStatus, convertStatus, StatusBadge} from "@/components/common/StatusBadge";
import {OrderSingle} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {useEffect} from "react";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";

const formatCurrency = (num: number) => new Intl.NumberFormat().format(num)

export default function OrderDetailPage() {
    const params = useParams();
    const {id} = params;
    const t = useTranslations();
    const [order, getOrderById, proxyLoading, status, error] = OrderSingle.useStore(useShallow(s =>
        [s.order, s.getBydId, s.proxyLoading, s.status, s.error]))


    useEffect(() => {
        const idNum = Number(id);
        if (!isNaN(idNum)) {
            proxyLoading(() => getOrderById(idNum), 'get')
        }
    }, []);

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <h3>
                        {t("order_detail")} #{id}
                    </h3>
                    <p className="text-sm font-normal text-muted-foreground">
                        {t("order_detail_description")}
                    </p>
                </div>
                <Button variant={"outline"} className="flex items-center gap-2">
                    <FaCartPlus/>
                    {t("buy_product_again")}
                </Button>
            </CardHeader>
            <StatusDependentRenderer status={status} error={typeof error === 'undefined' ? null : error}>
                <CardContent className="flex flex-col gap-6">
                    <h4 className="text-lg font-semibold">{t("order_information")}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order ID + Status */}
                        <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("created_at")}</span>
                                <span>{format(new Date(order.createdAt), "PPpp")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t("status")}</span>
                                <StatusBadge status={convertStatus(order.orderStatus ?? 'PENDING')}/>
                            </div>
                        </div>

                        {/* Created & Deleted Date */}
                        <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("original_total")}</span>
                                <span
                                    className="font-medium text-destructive">{formatCurrency(order.originalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("total_paid")}</span>
                                <span className="font-medium text-green-600">{formatCurrency(order.amount)}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("payment_status")}</span>
                                <StatusBadge status={convertPaymentStatus(order?.payment?.status)}/>
                            </div>
                            {order.payment?.paymentMethod && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t("payment_method")}</span>
                                    <span>{order.payment.paymentMethod}</span>
                                </div>
                            )}
                            {order.payment?.cardType && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t("card_type")}</span>
                                    <span>{order.payment.cardType}</span>
                                </div>
                            )}
                        </div>

                        {/* Coupon Info */}
                        <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("coupon_code")}</span>
                                <span className="font-medium">{order.coupon?.code || t("none")}</span>
                            </div>
                            {order.coupon?.value ? (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{t("discount_value")}</span>
                                    <span>{order.coupon.value}%</span>
                                </div>
                            ) : null}
                        </div>

                    </div>
                </CardContent>
            </StatusDependentRenderer>
            <CardFooter className="flex flex-row gap-4 max-h-[400px] overflow-y-auto">
                {order.details.map((od, index) => (
                    <OrderDetailItem orderDetail={od} key={index}/>
                ))}
            </CardFooter>
        </Card>
    );
}
