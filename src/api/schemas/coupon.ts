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

export const CouponSchema = z.object({
  id: z.number(),
  code: z.string(),
  type: z.string(),
  availableFrom: z.string(),
  availableTo: z.string(),
  value: z.number(),
  minAmount: z.number(),
  maxAppliedAmount: z.number(),
  usageLimit: z.number(),
  description: z.string(),
});

const applyRefinement = (schema: z.ZodTypeAny) => {
  return schema.refine((val) => {
    const fromDate = new Date(val.availableFrom);
    const toDate = new Date(val.availableTo);
    return fromDate < toDate;
  }, messages.fromtoConstraint);
};

const CouponValidation = z.object({
  code: z
    .string()
    .min(3, messages.code)
    .refine((val) => /^[a-zA-Z0-9]+$/.test(val), messages.alphaNumberic),
  type: z.string(),
  availableFrom: z.string(),
  availableTo: z.string(),
  value: z.preprocess((val) => Number(val), z.number().positive(messages.gt0)),
  minAmount: z.number().nonnegative(messages.nonnegative),
  maxAppliedAmount: z.number().nonnegative(messages.nonnegative),
  usageLimit: z.number().nonnegative(messages.nonnegative),
  description: z.string(),
});

export const CouponCreateSchema = applyRefinement(CouponValidation);

export const CouponUpdateSchema = applyRefinement(
  CouponValidation.extend({
    id: z.number(),
  }).partial()
);
