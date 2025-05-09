import { z } from "zod";
import { UserProfileSchema } from "@/api";



export const PaymentSchema = z.object({
    id: z.number(),
    status: z.string(),
    orderId: z.number(),
    user: UserProfileSchema,
    paymentMethod: z.string(),
    amount: z.number(),
    currency: z.string(),
    bankCode: z.string(),
    orderInfo: z.string(),
    cardInfo: z.string(),
    createAt: z.string(),
})

