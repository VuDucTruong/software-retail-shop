import { z } from "zod";
import { CouponSchema, ProductMetadataSchema } from "@/api";

export const OrderDetailSchema = z.object({
  price: z.number(),
  quantity: z.number(),
  product: ProductMetadataSchema,
});

export const OrderSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  deletedAt: z.string(),
  coupon: CouponSchema,
  totalValue: z.number(),
  orderStatus: z.string(),
  details: z.array(OrderDetailSchema),
});
