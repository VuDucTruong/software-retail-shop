import { z } from "zod";
import { CouponCreateSchema, CouponSchema, CouponUpdateSchema } from "..";

export type Coupon = z.infer<typeof CouponSchema>;
export type CouponCreate = z.infer<typeof CouponCreateSchema>;
export type CouponUpdate = z.infer<typeof CouponUpdateSchema>;