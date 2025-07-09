"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ClipboardCopy, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useShallow } from "zustand/react/shallow";
import { OrderSingle } from "@/stores/order/order.store";
import { toast } from "sonner";
import { StatusDependentRenderer } from "@/components/special/LoadingPage";
import { getDateTimeLocal } from "@/lib/date_helper";
import {convertPaymentStatus, convertStatus, StatusBadge} from "@/components/common/StatusBadge";
import {StringUtils} from "@/lib/utils";
import { convertPriceToVND } from "@/lib/currency_helper";

type TransactionDetailDialogProps = { orderId: number };

export default function TransactionDetailDialog({
  orderId,
}: TransactionDetailDialogProps) {
  const t = useTranslations();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"} className="w-8 h-8">
          <Eye />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("order_detail")}</DialogTitle>
        </DialogHeader>

        <DialogLazyContent orderId={orderId} />
      </DialogContent>
    </Dialog>
  );
}

function getLastSegment(input: string | null): string | null {
  if (input === null) return null;
  if (input.includes(',')) {
    const parts = input.split(',');
    return parts[parts.length - 1].trim(); // optional trim
  }
  return input;
}

function DialogLazyContent({ orderId }: TransactionDetailDialogProps) {
  const t = useTranslations();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [order, getOrderById, proxyLoading, status] = OrderSingle.useStore(
    useShallow((s) => [s.order, s.getBydId, s.proxyLoading, s.status])
  );
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast(t("copied_to_clipboard"), { description: getDateTimeLocal() });
  };
  useEffect(() => {
    proxyLoading(() => getOrderById(orderId), "get");
  }, []);
  return (
    <StatusDependentRenderer status={status} error={"error"}>
      {/* Profile */}
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center border-b pb-4 mb-4">
        <Image
          src={"/empty_img.png"}
          alt="Profile image"
          width={64}
          height={64}
          className="rounded-full border"
        />
        <div>
          <p className="font-semibold text-lg">{order.profile.fullName}</p>
          <p className="text-sm text-muted-foreground">{order.profile.email}</p>
        </div>
        <div>
          <StatusBadge
            status={convertStatus(order?.orderStatus ?? "PENDING")}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4 mb-4">
        <div>
          <p className="font-medium inline">{t("order_id")}:</p>
          <p className="inline"> {order.id}</p>
        </div>
        <div>
          <p className="font-medium inline">{t("created_at")}:</p>
          <p className="inline"> {order.createdAt}</p>
        </div>
        <div>
          <p className="font-medium inline">{t("Amount")}:</p>
          <p className="inline"> {convertPriceToVND(order.originalAmount)}</p>
        </div>
        <div>
          <p className="font-medium inline">{t("total_amount")}:</p>
          <p className="inline"> {convertPriceToVND(order.amount)}</p>
        </div>
        {order.orderStatus && (
          <>
            {(() => {
              if (
                order.orderStatus !== "FAILED" &&
                order.orderStatus !== "FAILED_MAIL"
              )
                return null;
              if (order.orderStatus === "FAILED")
                return (
                  <div className="col-span-2">
                    <p className="font-medium inline">{t("failure_reason")}:</p>
                    <p className="inline">
                      {order?.payment?.detailMessage || t("reason_fail_payment")}
                    </p>
                  </div>
                );
              if (order.orderStatus === "FAILED_MAIL")
                return (
                  <div className="col-span-2">
                    <p className="font-medium">{t("failure_reason")}:</p>
                    <p className="inline">{getLastSegment(order.reason) || "-"}</p>
                  </div>
                );
            })()}
          </>
        )}
      </div>

      {/* Payment */}
      {order.payment && (
        <div className="border-b pb-4 mb-4">
          <h3 className="font-semibold text-lg mb-2">{t("payment_info")}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium inline">{t("payment_method")}: </p>
              <p className="inline">{order.payment.paymentMethod || "-"}</p>
            </div>
            <div>
              <p className="font-medium inline">{t("order_status")}: </p>
              <StatusBadge className={"ml-1"}  status={convertPaymentStatus(order.payment.status)}/>
            </div>
            <div className="col-span-2">
              <p className="font-medium inline">{t("Note")}:</p>
              {(StringUtils.hasLength(order.payment.note) || order.payment.note === 'No Message') && <p > {order.payment.note}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-2">
        <h3 className="font-semibold text-lg mb-2">{t("order_items")}</h3>
        <div className="grid gap-3">
          {order.details.map((detail, i) => {
            const hasKeys =
              Array.isArray(detail.product.keys) &&
              detail.product.keys.length > 0;
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={i}
                className="border rounded-lg p-4 flex flex-col gap-2 bg-muted/30 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{detail.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("Quantity")}: {detail.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{convertPriceToVND(detail.price)}</p>
                    {hasKeys && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-xs px-1.5 py-0"
                        onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" /> {t("hide_keys")}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" /> {t("show_keys")}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && hasKeys && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 flex flex-col gap-2">
                        {detail.product.keys!.map((key, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(key)}
                              className="shrink-0"
                            >
                              <ClipboardCopy className="w-4 h-4" />
                            </Button>
                            <Input
                              value={key}
                              readOnly
                              className="bg-white/70 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </StatusDependentRenderer>
  );
}
