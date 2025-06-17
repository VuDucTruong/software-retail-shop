import {z} from "zod";
import {CouponCreateSchema, CouponListSchema, CouponSchema, CouponUpdateSchema} from "@/api";

export type Coupon = z.infer<typeof CouponSchema>;
export type CouponCreate = z.infer<typeof CouponCreateSchema>;
export type CouponUpdate = z.infer<typeof CouponUpdateSchema>;
export type CouponList = z.infer<typeof CouponListSchema>;

export const COUPON_FALL_BACK: Coupon = {
    id: 0,
    code: "UNKNOWN",
    minAmount: 0,
    maxAppliedAmount: 0,
    description: "",
    type: 'PERCENTAGE',
    value: 0,
    availableTo: new Date().toISOString(),
    availableFrom: new Date().toISOString(),
    usageLimit: 0
}