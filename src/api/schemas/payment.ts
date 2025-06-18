import {undefined, z} from "zod";
import {UserProfileSchema, zEnumDefault, zNumDefault, zStrDefault} from "@/api";
import {BANK_CODES} from "@/lib/bankcodes";


export const PaymentSchema = z.object({
    id: z.number(),
    status: z.string(),
    orderId: z.number(),
    deletedAt: z.string(),
    user: UserProfileSchema,
    paymentMethod: z.string(),
    amount: z.number(),
    currency: z.string(),
    bankCode: z.enum(BANK_CODES),
    orderInfo: z.string(),
    cardInfo: z.string(),
    createAt: z.string(),
})
export const PaymentStatusSchema = z.enum(['SUCCESS', 'PENDING', 'FAILED'] )

const PaymentBaseSchema = z.object({
    id: z.number(),
    profileId: z.number(),
    status: PaymentStatusSchema.nullish(),
    paymentMethod: z.string().nullish(),
    detailCode: z.string().nullish(),
    detailMessage: z.string().nullish(),
    note: z.string(),
    cardType: z.string().nullish(),
})
export const PaymentResponseSchema = z.object({
    id: zNumDefault(0),
    orderId: zNumDefault(0),
    profileId: zNumDefault(0),
    status: zEnumDefault(PaymentStatusSchema,'PENDING'),
    paymentMethod: zStrDefault(''),
    detailCode: zStrDefault(''),
    detailMessage: zStrDefault(''),
    note: z.string(),
    cardType: zStrDefault(''),
})




export const PaymentCreateSchema = z.object({
    orderId: z.number(),
    bankCode: z.enum(BANK_CODES).nullish(),
    note: z.string(),
})

export const PaymentUrlRequestSchema = PaymentCreateSchema.extend({
    callbackUrl: z.string()
})


export const PaymentDomainSchema = PaymentBaseSchema.extend({})

