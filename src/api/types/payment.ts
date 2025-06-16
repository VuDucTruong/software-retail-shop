import {z} from "zod";
import {
    PaymentCreateSchema,
    PaymentDomainSchema,
    PaymentSchema,
    PaymentStatusSchema,
    PaymentUrlRequestSchema
} from "@/api";

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>
export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentDomain = z.infer<typeof PaymentDomainSchema>
export type PaymentCreateDomain = z.infer<typeof PaymentCreateSchema>
export type PaymentUrlRequest = z.infer<typeof PaymentUrlRequestSchema>

export const PAYMENT_FALLBACK: PaymentDomain = {
    id: 0,
    search: 0,
    note: '',
    profileId: 0,
    status: 'PENDING',
    detailCode: '',
    cardType: '',
    detailMessage: '',
    paymentMethod: 'ATM',
}