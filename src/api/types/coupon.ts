import { z } from "zod";
import { CouponCreateSchema, CouponListSchema, CouponSchema, CouponUpdateSchema } from "@/api";

export type Coupon = z.infer<typeof CouponSchema>;
export type CouponCreate = z.infer<typeof CouponCreateSchema>;
export type CouponUpdate = z.infer<typeof CouponUpdateSchema>;
export type CouponList = z.infer<typeof CouponListSchema>;