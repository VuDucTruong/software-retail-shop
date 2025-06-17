"use client"

import { useEffect, useState } from "react"
import { Eye, ClipboardCopy, ChevronDown, ChevronUp } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useShallow } from "zustand/react/shallow"
import {OrderSingle} from "@/stores/order/order.store";
import {toast} from "sonner";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";

type TransactionDetailDialogProps = { orderId: number }

export default function TransactionDetailDialog({ orderId }: TransactionDetailDialogProps) {
    const t = useTranslations()
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const [order, getOrderById, proxyLoading, status] = OrderSingle.useStore(
        useShallow((s) => [s.order, s.getBydId, s.proxyLoading, s.status])
    )

    useEffect(() => {
        proxyLoading(() => getOrderById(orderId), "get")
    }, [])

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key)
        // toast({ description: t("Copied to clipboard") })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-primary text-white">
                    <Eye className="mr-2 w-4 h-4" /> {t("Detail")}
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{t("Order Detail")}</DialogTitle>
                </DialogHeader>

                <StatusDependentRenderer status={status} error={"error"}>
                    {/* Profile */}
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-center border-b pb-4 mb-4">
                        <Image
                            src={order.profile.imageUrl || "/empty_user.png"}
                            alt="Profile image"
                            width={64}
                            height={64}
                            className="rounded-full border"
                        />
                        <div>
                            <p className="font-semibold text-lg">{order.profile.fullName}</p>
                            <p className="text-sm text-muted-foreground">{order.profile.email}</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4 mb-4">
                        <div>
                            <p className="font-medium">{t("Order ID")}:</p>
                            <p>{order.id}</p>
                        </div>
                        <div>
                            <p className="font-medium">{t("Created At")}:</p>
                            <p>{order.createdAt}</p>
                        </div>
                        <div>
                            <p className="font-medium">{t("Original Amount")}:</p>
                            <p>{order.originalAmount}</p>
                        </div>
                        <div>
                            <p className="font-medium">{t("Final Amount")}:</p>
                            <p>{order.amount}</p>
                        </div>
                        {order.orderStatus && (
                            <div>
                                <p className="font-medium">{t("Status")}:</p>
                                <p>{order.orderStatus}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment */}
                    {order.payment && (
                        <div className="border-b pb-4 mb-4">
                            <h3 className="font-semibold text-lg mb-2">{t("Payment Info")}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">{t("Method")}:</p>
                                    <p>{order.payment.paymentMethod || "-"}</p>
                                </div>
                                <div>
                                    <p className="font-medium">{t("Status")}:</p>
                                    <p>{order.payment.status || "-"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-medium">{t("Note")}:</p>
                                    <p>{order.payment.note || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="mb-2">
                        <h3 className="font-semibold text-lg mb-2">{t("Order Items")}</h3>
                        <div className="grid gap-3">
                            {order.details.map((detail, i) => {
                                const hasKeys = Array.isArray(detail.product.keys) && detail.product.keys.length > 0
                                const isExpanded = expandedIndex === i

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
                                                <p className="font-medium">{detail.price} VND</p>
                                                {hasKeys && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-1 text-xs px-1.5 py-0"
                                                        onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4" /> {t("Hide Keys")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4" /> {t("Show Keys")}
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
                                                                <Input value={key} readOnly className="bg-white/70 text-sm" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </StatusDependentRenderer>
            </DialogContent>
        </Dialog>
    )
}
