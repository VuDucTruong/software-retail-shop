import {z} from "zod";
import {
    ApiResponseSchema,
    CouponSchema,
    PaymentDomainSchema,
    PaymentResponseSchema,
    UserProfileDetailedSchema,
    zNumDefault,
    zStrDefault
} from "@/api";

const EMPTY_IMG = 'empty_img.png'

export const OrderStatusSchema = z.enum(['PENDING', 'PROCESSING', 'RETRY_1', 'FAILED_MAIL', 'COMPLETED', 'FAILED'])


/// order details
export const OrderDetailProductSchema = z.object({
    id: zNumDefault(0),
    name: zStrDefault(EMPTY_IMG),
    imageUrl: z.string().nullable(),
    slug: zStrDefault(EMPTY_IMG),
    quantity: zNumDefault(0),
    tags: z.array(zStrDefault(EMPTY_IMG))
})

export const OrderDetailSchema = z.object({
    id: zNumDefault(0),
    price: zNumDefault(0),
    originalPrice: zNumDefault(0),
    quantity: zNumDefault(0),
    product: OrderDetailProductSchema,
});
///END order details


export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    deletedAt: z.string().nullable(),
    profile: UserProfileDetailedSchema,
    orderStatus: OrderStatusSchema.nullable(),
    coupon: CouponSchema,
    originalAmount: z.number(),
    amount: z.number(),
    payment: PaymentDomainSchema.nullable(),
    details: z.array(OrderDetailSchema),
});

export const OrderResponseSchema = z.object({
    id: zNumDefault(0),
    createdAt: zStrDefault(new Date().toISOString()),
    deletedAt: z.string().nullish(),
    profile: UserProfileDetailedSchema.nullish(),
    coupon: CouponSchema.nullish(),
    status: OrderStatusSchema.nullish(),
    originalAmount: zNumDefault(0),
    amount: zNumDefault(0),
    payment: PaymentResponseSchema.nullish(),
    details: z.array(OrderDetailSchema).nullish(),
})

export const OrderDetailCreateSchema = z.object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
});

export const OrderCreateSchema = z.object({
    couponCode: z.string().optional(),
    requestInfo: z.record(z.string().nullish(), z.string().min(1)),
    orderDetails: z.array(OrderDetailCreateSchema)
})


export const OrderPageSchema = ApiResponseSchema(z.array(
    OrderResponseSchema
))