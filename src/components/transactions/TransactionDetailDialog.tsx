import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Eye} from "lucide-react";
import {useTranslations} from "next-intl";
import Image from "next/image";
import {Order} from "@/api";

interface TransactionDetailDialogProps {
    order: Order
}

export default function TransactionDetailDialog({order}: TransactionDetailDialogProps) {
    const t = useTranslations();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-primary text-white">
                    <Eye className="mr-2 w-4 h-4"/> {t("Detail")}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-1/2 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{t("Order Detail")}</DialogTitle>
                </DialogHeader>

                {/* User Profile */}
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center border-b pb-4">
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

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
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
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-semibold mb-2 text-lg">{t("Payment Info")}</h3>
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

                {/* Order Details */}
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2 text-lg">{t("Order Items")}</h3>
                    <div className="grid gap-3">
                        {order.details.map((detail, i) => (
                            <div
                                key={i}
                                className="flex justify-between border rounded-md p-3 text-sm"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{detail.product?.name}</span>
                                    <span className="text-muted-foreground text-xs">
                    {t("Quantity")}: {detail.quantity}
                  </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{detail?.price} VND</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
