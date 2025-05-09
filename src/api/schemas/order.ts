import { z } from "zod";
import { CouponSchema, ProductMetadataScheme } from "@/api";

export const OrderDetailSchema = z.object({
  price: z.number(),
  quantity: z.number(),
  product: ProductMetadataScheme,
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
