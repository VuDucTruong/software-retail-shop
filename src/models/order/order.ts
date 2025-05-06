import { z } from "zod";
import { CouponScheme } from "../coupon";
import { OrderDetailScheme } from "./order_detail";

export const OrderScheme = z.object({
    id: z.number(),
    createdAt: z.string(),
    deletedAt: z.string(),
    coupon: CouponScheme,
    totalValue: z.number(),
    orderStatus: z.string(),
    details: z.array(OrderDetailScheme),
})

export type Order = z.infer<typeof OrderScheme>;
