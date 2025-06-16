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
import parseStatus = PaymentCommon.parseStatus;
import {PaymentStatus} from "@/api";

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
    const [coupon, cartItemsCount, orderStatus, gross, applied, net, applyCoupon, applyMail, payment] = OrderCustomer.useStore(useShallow(s => [
        s.coupon, s.cartItems.length, s.orderStatus, s.gross, s.applied, s.net, s.applyCoupon, s.applyMail, s.payment
    ]));
    const [selectedBankCode, setSelectedBankCode, note, setNote] = PaymentSingle.useStore(useShallow(s => [
        s.bankCode, s.setBankCode, s.note, s.setNote
    ]))

    const [email, setEmail] = useState<string>("");
    const [couponCode, setCouponCode] = useState<string>("");
    const accordionItems = [
        // {
        //     title: "q_have_introduction_code",
        //     inputPlaceholder: "introduction_code",
        //     onApply: () => {
        //     },
        // },
        {
            value: couponCode,
            display: (
                coupon && (
                    <>
                        <TitleAndValue title={t("available_to")} value={getDateLocal(coupon.availableTo)}/>
                        <TitleAndValue title={"discount type"} value={coupon.type}/>
                        <TitleAndValue title={"Code"} value={coupon.code}/>
                        <TitleAndValue title={"Value"}
                                       value={coupon.type === 'FIXED' ? (coupon.value + " VND") : (coupon.value + " %")}/>
                        <TitleAndValue title={"For Order from"} value={coupon.minAmount + " VND"}/>
                        <TitleAndValue title={"Max applied"} value={coupon.maxAppliedAmount + " VND"}/>
                    </>

                )
            ),
            onValueChange: (value: string) => {
                // console.log(value)
                setCouponCode(c => value)
            },
            title: "q_have_discount_code",
            inputPlaceholder: "discount_code",
            onApply: () => {
                applyCoupon(couponCode)
            },
        },
        {
            value: email,
            display: null,
            onValueChange: (value: string) => setEmail(value),
            title: "q_give_friend",
            inputPlaceholder: "recipient_email",
            onApply: () => {
                applyMail(email)
            },
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h3>
                        {t("Cart")}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                            ( {cartItemsCount} {t("product")} )
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
                                            Chọn ngân hàng
                                        </label>
                                        <BankSelector
                                            bankCodes={[...BANK_CODES]}
                                            selected={selectedBankCode ?? ''}
                                            onChange={setSelectedBankCode}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-lg font-medium text-muted-foreground">
                                            Ghi chú thanh toán
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
                                        <TextWithValue text={'status'} value={parseStatus(payment?.status)}/>
                                        {payment?.detailMessage &&
                                            <TextWithValue text={'message'} value={payment.detailMessage}/>}
                                        {/*VNPAY*/}
                                        {payment?.paymentMethod &&
                                            <TextWithValue text={'payment method'} value={payment.paymentMethod}/>}
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
                                        {item.value}
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
                            value={gross + " VND"}
                        />
                        <TextWithValue
                            text={"Discount 15%"}
                            value={"- " + applied + "VND"}
                        />
                        <div className="w-full h-px bg-border"></div>
                        <TextWithValue text={t("total_amount_payable")} value={net + " VND"}/>

                        {mode === 'preview' && (
                            <Button onClick={handleNextStep}>
                                <MdQrCodeScanner/>
                                {t("purchase_mobile_banking")}
                            </Button>
                        )}

                        {mode === 'payment' && (
                            <>
                                <Button onClick={handleNextStep}>
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

    return (
        <div className="w-full space-y-2">
      <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          className=" w-full resize-none rounded-xl border border-gray-300 p-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary max-h-[8rem] overflow-auto"
          style={{lineHeight: '1.5'}}
          placeholder="Type your message..."
      />
        </div>
    );
}