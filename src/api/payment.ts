import { z } from "zod";
import { ProfileScheme } from "./profile";

export const PaymentScheme = z.object({
    id: z.number(),
    status: z.string(),
    orderId: z.number(),
    user: ProfileScheme,
    paymentMethod: z.string(),
    amount: z.number(),
    currency: z.string(),
    bankCode: z.string(),
    orderInfo: z.string(),
    cardInfo: z.string(),
    createAt: z.string(),
})

export type Payment = z.infer<typeof PaymentScheme>;