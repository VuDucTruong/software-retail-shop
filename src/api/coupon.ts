import { isoToDatetimeLocal } from "@/lib/date_helper";
import { z } from "zod";

const messages = {
  required: {
    code: "Code is required",
    availableFrom: "Available from is required",
    availableTo: "Available to is required",
  },
  gt0: "This field must be greater than 0",
  code: "Code must be at least 3 characters long",
  nonnegative: "This field must be a non-negative number",
  futureDate: "This field must be a future date",
  fromtoConstraint: "from date must be before to date",
  alphaNumberic: "Code must be alphanumeric",
};

export const CouponScheme = z.object({
  id: z.number(),
  code: z.string(),
  type: z.string(),
  availableFrom: z
    .string(),
  availableTo: z
    .string(),
  value: z.number(),
  minAmount: z.number(),
  maxAppliedAmount: z.number(),
  usageLimit: z.number(),
  description: z.string(),
}).partial();

export const CouponValidation = z.object({
  code: z
    .string()
    .min(3, messages.code)
    .refine((val) => /^[a-zA-Z0-9]+$/.test(val), messages.alphaNumberic),
  type: z.string(),
  availableFrom: z
    .string(),
  availableTo: z.string(),
  value: z.preprocess((val) => Number(val), z.number().positive(messages.gt0)),
  minAmount: z.number().nonnegative(messages.nonnegative),
  maxAppliedAmount: z.number().nonnegative(messages.nonnegative),
  usageLimit: z.number().nonnegative(messages.nonnegative),
  description: z.string(),
}).partial().superRefine((data, ctx) => {
  const fromDate = new Date(data.availableFrom!);
  const toDate = new Date(data.availableTo!);

  if (fromDate > toDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['availableFrom'],
      message: messages.fromtoConstraint,
    });

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['availableTo'],
      message: messages.fromtoConstraint,
    });
  }
});

export type Coupon = z.infer<typeof CouponScheme>;

const CouponCreateScheme = CouponScheme.omit({
  id: true,
});

export type CouponCreate = z.infer<typeof CouponCreateScheme>;

