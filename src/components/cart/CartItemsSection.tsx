import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {useTranslations} from "next-intl";
import CartItemList from "./CartItemList";
import {Button} from "../ui/button";
import {MdPayment, MdQrCodeScanner} from "react-icons/md";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../ui/accordion";
import {Input} from "../ui/input";
import EmptyList from "./EmptyList";
import {IoIosArrowBack} from "react-icons/io";
import {OrderCustomer} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {getDateLocal} from "@/lib/date_helper";
import {OrderStatusView} from "@/components/cart/OrderStatusView";
import {BankSelector} from "@/components/payment/BankSelector";
import {BANK_CODES} from "@/lib/bankcodes";
import {PaymentCommon, PaymentSingle} from "@/stores/order/payment.store";
import {convertPriceToVND} from "@/lib/currency_helper";
import {toast} from "sonner";
import parseStatus = PaymentCommon.parseStatus;
import { useAuthDialogStore } from "@/stores/auth.dialog.store";
import { useAuthStore } from "@/stores/auth.store";

type CardItemsProps = {
    handleNextStep: () => void;
    handlePrevStep: () => void;
    mode: "preview" | "payment" | "settlement"
};

function TitleAndValue({title, value}: { title: string, value: string }) {
    return (
        <div className="w-full flex justify-between text-sm text-muted-foreground">
            <span>{title}</span>
            <span>{value}</span>
        </div>
    )
}

export default function CartItemsSection({handleNextStep, handlePrevStep, mode}: CardItemsProps) {
    const t = useTranslations();
    const [coupon, cartItemsCount, orderStatus, gross, applied, net, applyCoupon,  payment] = OrderCustomer.useStore(useShallow(s => [
        s.coupon, s.cartItems.length, s.orderStatus, s.gross, s.applied, s.net, s.applyCoupon,  s.payment
    ]));
    const [selectedBankCode, setSelectedBankCode, setNote] = PaymentSingle.useStore(useShallow(s => [
        s.bankCode, s.setBankCode,  s.setNote
    ]))
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const onOpenChange = useAuthDialogStore((state) => state.onOpenChange);
    

    const [couponCode, setCouponCode] = useState<string>("");
    const accordionItems = [
        {
            value: couponCode,
            display: (
                coupon && (
                    <>
                        <TitleAndValue title={t("Code")} value={coupon.code}/>
                        <TitleAndValue title={t("available_to")} value={getDateLocal(coupon.availableTo)}/>
                        <TitleAndValue title={t("discount_type")} value={coupon.type}/>
                        <TitleAndValue title={t("discount_value")}
                                       value={coupon.type === 'FIXED' ? (convertPriceToVND(coupon.value)) : (coupon.value + " %")}/>
                        <TitleAndValue title={t("min_amount")} value={convertPriceToVND(coupon.minAmount)}/>
                        <TitleAndValue title={t("max_applied_amount")} value={convertPriceToVND(coupon.maxAppliedAmount)}/>
                    </>
                )
            ),
            onValueChange: (value: string) => {
                // console.log(value)
                setCouponCode(() => value)
            },
            title: "q_have_discount_code",
            inputPlaceholder: "discount_code",
            onApply: () => {
                applyCoupon(couponCode).catch(()=>{
                    toast.error(t("API.INVALID_COUPON"))
                })
            },
        },
        // {
        //     value: email,
        //     display: null,
        //     onValueChange: (value: string) => setEmail(value),
        //     title: "q_give_friend",
        //     inputPlaceholder: "recipient_email",
        //     onApply: () => {
        //         applyMail(email)
        //     },
        // },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h3>
                        {t("Cart")}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                            ( {cartItemsCount} {t("Products")} )
                        </span>
                    </h3>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-8">
                {cartItemsCount == 0 && <EmptyList/>}
                {cartItemsCount > 0 && (
                    <div className="w-full">
                        {
                            /// IF NOT yet paid OR payment PENDING
                            (mode === 'payment' && (payment === null || payment?.status === null || payment?.status === 'PENDING')) ? (
                                <div className="space-y-4">
                                    <div className="space-y-1 ">
                                        <label className="block text-lg  font-medium text-muted-foreground ">
                                            {t("select_your_bank")}
                                        </label>
                                        <BankSelector
                                            bankCodes={[...BANK_CODES]}
                                            selected={selectedBankCode ?? ''}
                                            onChange={setSelectedBankCode}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-lg font-medium text-muted-foreground">
                                            {t("your_message")}
                                        </label>
                                        <MessageBox onChange={(data) => setNote(data)}/>
                                    </div>
                                </div>
                            ) : null
                        }
                        <CartItemList/>
                    </div>
                )}

                <div className="w-[400px]">
                    {
                        (() => {
                            if (mode === 'payment' && orderStatus !== null && orderStatus !== undefined) {
                                return (
                                    <><OrderStatusView orderStatus={orderStatus ?? 'PENDING'}>
                                        <TextWithValue text={t('Status')} value={parseStatus(payment?.status)}/>
                                        {payment?.detailMessage &&
                                            <TextWithValue text={t('message')} value={payment.detailMessage}/>}
                                        {/*VNPAY*/}
                                        {payment?.paymentMethod &&
                                            <TextWithValue text={t("payment_method")} value={payment.paymentMethod}/>}
                                        {/*BANK credit card or debit or qr code*/}
                                        {payment?.cardType &&
                                            <TextWithValue text={'card type'} value={payment.cardType}/>}
                                    </OrderStatusView></>
                                )
                            }
                            return null
                        })()
                    }
                    <Accordion type="multiple" className="w-full">
                        {accordionItems.map((item, index) => {
                            return (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="hover:text-primary text-[16px]">
                                        {t(item.title)}
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 py-2">
                                        <div className="flex gap-2 py-2">
                                            <Input value={item.value} onChange={e => item.onValueChange(e.target.value)}
                                                   placeholder={t(item.inputPlaceholder)}/>
                                            <Button onClick={item.onApply} variant="outline">
                                                {t("Apply")}
                                            </Button>
                                        </div>
                                        {item.display}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                    {/*
                        TODO: GROSS-APPLIED-NET
                    */}
                    <div className="w-full flex flex-col gap-2">
                        <p className="font-semibold">{t("Payment")}</p>
                        {/* Preview value */}
                        <TextWithValue
                            text={t("total_product_value")}
                            value={convertPriceToVND(gross)}
                        />
                        <TextWithValue
                            text={t("Discount")}
                            value={"- " + convertPriceToVND(applied)}
                        />
                        <div className="w-full h-px bg-border"></div>
                        <TextWithValue text={t("total_amount_payable")} value={convertPriceToVND(net)}/>

                        {mode === 'preview' && (
                            <Button onClick={()=>{
                                if (!isAuthenticated) {
                                    onOpenChange(true);
                                    return;
                                }
                                handleNextStep();
                            }}>
                                <MdQrCodeScanner/>
                                {t("purchase_mobile_banking")}
                            </Button>
                        )}

                        {mode === 'payment' && (
                            <>
                                <Button onClick={() => {
                                    if (!isAuthenticated) {
                                        onOpenChange(true);
                                        return;
                                    }
                                    handleNextStep();
                                    }}>
                                    <MdPayment/> {t("Confirm")}{" "}
                                </Button>

                                <Button
                                    variant={"link"}
                                    className="flex items-center justify-end w-full"
                                    onClick={handlePrevStep}
                                >
                                    <IoIosArrowBack/>
                                    {t("return_to_cart")}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TextWithValue({text, value}: { text: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span>{text}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}

function MessageBox({onChange}: { onChange(text: string): void }) {
    const [text, setText] = useState('');

    function onTextChange(data: string) {
        setText(data);
        onChange(data)
    }
    const t = useTranslations()

    return (
        <div className="w-full space-y-2">
      <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          className=" w-full resize-none rounded-xl border border-gray-300 p-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary max-h-[8rem] overflow-auto"
          style={{lineHeight: '1.5'}}
          placeholder={`${t("type_your_message")}...`}
      />
        </div>
    );
}