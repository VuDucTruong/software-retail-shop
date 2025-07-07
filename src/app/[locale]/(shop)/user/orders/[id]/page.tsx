"use client";

import OrderDetailItem from "@/components/orders/OrderDetailItem";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {useTranslations} from "next-intl";
import {useParams} from "next/navigation";
import {FaCartPlus} from "react-icons/fa";
import {format} from "date-fns";
import {
  convertPaymentStatus,
  convertStatus,
  StatusBadge,
} from "@/components/common/StatusBadge";
import {OrderSingle} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {useEffect} from "react";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";
import {convertPriceToVND} from "@/lib/currency_helper";
import {CartLocal} from "@/stores/order/cart.store";
import {toast} from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const {id} = params;
  const t = useTranslations();
  const [order, status, error, getOrderById, proxyLoading,] =
    OrderSingle.useStore(
      useShallow((s) => [
        s.order,
        s.status,
        s.error,
        s.getBydId,
        s.proxyLoading,
      ])
    );
  const [setItem] = CartLocal.useStore(useShallow(s => [s.setItem]))

  function buyProductAgain() {
    order.details.forEach(odm => {
      setItem(`${odm.product.id}`, {name: odm.product.name, qty: 1})
    })
    toast.success(t('added_x_to_cart', {x: `${order.details.length}`}))
  }

  useEffect(() => {
    const idNum = Number(id);
    if (!isNaN(idNum)) {
      proxyLoading(() => getOrderById(idNum), "get");
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
        <Button onClick={buyProductAgain} variant={"outline"} className="flex items-center gap-2">
          <FaCartPlus/>
          {t("buy_product_again")}
        </Button>
      </CardHeader>
      <StatusDependentRenderer
        status={status}
        error={typeof error === "undefined" ? null : error}
      >
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
                <span className="text-muted-foreground">{t("Status")}</span>
                <StatusBadge
                  status={convertStatus(order.orderStatus ?? "PENDING")}
                />
              </div>
            </div>

            {/* Created & Deleted Date */}
            <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("original_total")}
                </span>
                <span className="font-medium text-destructive">
                  {convertPriceToVND(order.originalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("total_paid")}</span>
                <span className="font-medium text-green-600">
                  {convertPriceToVND(order.amount)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment_status")}
                </span>
                <StatusBadge
                  status={convertPaymentStatus(order?.payment?.status)}
                />
              </div>
              {order.payment?.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("payment_method")}
                  </span>
                  <span>{order.payment.paymentMethod}</span>
                </div>
              )}
              {order.payment?.cardType && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("card_type")}
                  </span>
                  <span>{order.payment.cardType}</span>
                </div>
              )}
            </div>

            {/* Coupon Info */}
            {order.coupon.code !== "UNKNOWN" && (
              <div className="border rounded-xl p-4 flex flex-col gap-2 bg-muted/30">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("coupon_code")}
                  </span>
                  <span className="font-medium">{order.coupon?.code}</span>
                </div>
                {order.coupon?.value ? (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t("discount_value")}</span>
                    <span>{order.coupon.value}%</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </CardContent>
      </StatusDependentRenderer>
      <CardFooter className="grid grid-cols-2 gap-4 max-h-[400px] items-start">
        {order.details.map((od, index) => (
          <OrderDetailItem orderDetail={od} key={index}/>
        ))}
      </CardFooter>
    </Card>
  );
}
