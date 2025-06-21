import {
    COUPON_FALL_BACK,
    OrderCreateSchema,
    OrderDetailCreateSchema,
    OrderDetailSchema,
    OrderPageSchema,
    OrderResponseSchema,
    OrderSchema,
    OrderStatusSchema,
    PAYMENT_FALLBACK,
    USER_PROFILE_DETAILED_FALL_BACK
} from "@/api";
import {z} from "zod";
import {getDateTimeLocal} from "@/lib/date_helper";

export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>
export type OrderDetailRequest = z.infer<typeof OrderDetailCreateSchema>
export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>
export type OrderDetailResponse = z.infer<typeof OrderDetailSchema>
export type OrderPage = z.infer<typeof OrderPageSchema>

export const ORDER_FALL_BACK: Order = {
    id: 0,
    sentMail: '',
    profile: USER_PROFILE_DETAILED_FALL_BACK,
    originalAmount: 0,
    amount: 0,
    payment: PAYMENT_FALLBACK,
    coupon: COUPON_FALL_BACK,
    createdAt: getDateTimeLocal(new Date().toISOString()),
    deletedAt: null,
    details: [],
    orderStatus: 'PENDING',
}
