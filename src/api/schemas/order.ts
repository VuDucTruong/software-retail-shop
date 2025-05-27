import { z } from "zod";
import { CouponSchema, ProductMetadataSchema } from "@/api";

export const OrderDetailSchema = z.object({
  price: z.number(),
  originalPrice: z.number(),
  productId: z.number().positive(),
  quantity: z.number(),
  product: ProductMetadataSchema,
});

export const OrderDetailListSchema = z.array(OrderDetailSchema)

export const OrderSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  deletedAt: z.string(),
  coupon: CouponSchema,
  totalValue: z.number(),
  orderStatus: z.string(),
  details: z.array(OrderDetailSchema),
});

export const OrderDetailCreateSchema =z.object({
  price: z.number(),
  quantity: z.number(),
});
export const OrderDetailCreateListSchema = z.array(OrderDetailSchema);

export const OrderCreateSchema = z.object({
  couponCode: z.string().optional(),
  requestInfo: z.record(z.string().nullish(),z.string().min(1)),
  orderDetails: OrderDetailCreateListSchema
})
export const OrderResponseSchema = OrderSchema.partial().extend({
  id: z.number(),

})