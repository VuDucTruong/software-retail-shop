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
