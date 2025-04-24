import { z } from "zod";
import { CouponScheme } from "./coupon";

export const OrderScheme = z.object({
    id: z.number(),
    createAt: z.string(),
    deleteAt: z.string(),
    coupon: CouponScheme,
    totalValue: z.number(),
})


