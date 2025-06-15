import {z} from "zod";
import {CouponSchema, makeNullable, PaymentDomainSchema, PaymentResponseSchema, UserProfileSchema} from "@/api";


export const OrderStatusSchema = z.enum(['PENDING','PROCESSING','RETRY_1','FAILED_MAIL','COMPLETED','FAILED'])


/// order details
export const OrderDetailProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    slug: z.string(),
    quantity: z.number(),
    tags: z.array(z.string())
})

export const OrderDetailSchema = z.object({
    id: z.number(),
    price: z.number(),
    originalPrice: z.number(),
    quantity: z.number(),
    product: OrderDetailProductSchema,
});
///END order details


export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    deletedAt: z.string(),
    profile: UserProfileSchema,
    orderStatus: OrderStatusSchema.nullable(),
    coupon: CouponSchema,
    totalValue: z.number(),
    payment: PaymentDomainSchema,
    details: z.array(OrderDetailSchema),
});

export const OrderDetailCreateSchema = z.object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
});

export const OrderCreateSchema = z.object({
    couponCode: z.string().optional(),
    requestInfo: z.record(z.string().nullish(), z.string().min(1)),
    orderDetails: z.array(OrderDetailCreateSchema)
})


export const OrderResponseSchema = makeNullable(OrderSchema.omit({
    details: true,
    orderStatus: true,
})).partial().extend({
    details: z.array(makeNullable(OrderDetailSchema)).nullish(),
    payment: PaymentResponseSchema.nullish(),
    status: OrderStatusSchema.nullish(),
})