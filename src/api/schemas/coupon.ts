import { z } from "zod";
import { ApiResponseSchema, DateSchema, DatetimeSchema } from "./common";

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

export const CouponSchema = z.object({
  id: z.number(),
  code: z.string(),
  type: z.string(),
  availableFrom: DatetimeSchema,
  availableTo: DatetimeSchema,
  value: z.number(),
  minAmount: z.number(),
  maxAppliedAmount: z.preprocess(
    (val) => {
      if(val) return Number(val);
      return 0;
    },
    z.number()
  ),
  usageLimit: z.number(),
  description: z.string(),
});

const applyRefinement = (schema: z.ZodTypeAny) => {
  return schema.superRefine((val, ctx) => {
    const fromDate = new Date(val.availableFrom);
    const toDate = new Date(val.availableTo);

    if (fromDate >= toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.fromtoConstraint,
        path: ["availableFrom"],
      });
    }

    if (val.type === "PERCENTAGE") {
      if (val.maxAppliedAmount < 10000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Max applied amount must be greater than 10000 for percentage coupons",
          path: ["maxAppliedAmount"],
        });
      }
    } else {
      if (val.value > val.minAmount) {
        console.log(val.value, val.minAmount, val.type);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value must be less than min amount",
          path: ["value"],
        });
      }
    }
  });
};

const CouponValidation = z.object({
  code: z.string().min(3, messages.code),
  type: z.string(),
  availableFrom: DateSchema,
  availableTo: DateSchema,
  value: z.preprocess((val) => Number(val), z.number().positive(messages.gt0)),
  minAmount: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative(messages.nonnegative)
  ),
  maxAppliedAmount: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative(messages.nonnegative)
  ),
  usageLimit: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative(messages.nonnegative)
  ),
  description: z.string(),
});

export const CouponCreateSchema = applyRefinement(CouponValidation);

export const CouponUpdateSchema = applyRefinement(
  CouponValidation.extend({
    id: z.number(),
  }).partial()
);

export const CouponListSchema = ApiResponseSchema(z.array(CouponSchema));
