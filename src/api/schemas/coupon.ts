import { z } from "zod";
import { ApiDatetimeSchema, ApiResponseSchema, DateSchema, DatetimeSchema } from "./common";

const messages = {
  required: {
    code: "Input.error_coupon_code_required",
    availableFrom: "Input.error_available_from_required",
    availableTo: "Input.error_available_to_required",
  },
  gt0: "Input.error_value_gt0",
  code: "Input.error_coupon_code_invalid",
  nonnegative: "Input.error_nonnegative",
  futureDate: "Input.error_future_date",
  fromtoConstraint: "Input.error_from_to_constraint",
  alphaNumberic: "Input.error_coupon_code_alphanumeric",
  valueConstraint: "Input.error_value_constraint",
};

export const CouponSchema = z.object({
  id: z.number(),
  code: z.string(),
  type: z.string(),
  availableFrom: DateSchema,
  availableTo: DateSchema,
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

    if (val.type === "FIXED") {
      if (val.value > val.minAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.valueConstraint,
          path: ["value"],
        });
      }
    }
  });
};

const CouponValidation = z.object({
  code: z.string().min(3, messages.code),
  type: z.string(),
  availableFrom: ApiDatetimeSchema,
  availableTo: ApiDatetimeSchema,
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
