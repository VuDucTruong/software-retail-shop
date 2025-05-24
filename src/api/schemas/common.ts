import {z} from "zod";

const passwordRegex = /^[a-zA-Z0-9]+$/; // At least 6 characters, at least one letter and one number
export const PasswordSchema = z
    .string()
    .min(6, {
        message: "Input.error_password_min",
    })
    .max(40, {
        message: "Input.error_password_max",
    })
    .regex(passwordRegex, {
        message: "Input.error_password_format",
    })

export const QueyParamsSchema = z
  .object({
    pageRequest: z.object({
      page: z.number(),
      size: z.number(),
      sortBy: z.string(),
      sortDirection: z.enum(["asc", "desc"]),
    }),
    ids: z.array(z.number()).optional(),
  })
  .catchall(z.any())
  .partial()
  .optional();

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    totalInstances: z.number().optional(),
    currentPage: z.number().optional(),
    totalPages: z.number().optional(),
  });

export const DateSchema = z
  .preprocess((val) => {
    if (typeof val === "string" || val instanceof String) {
      return new Date(val as string).toLocaleDateString();
    }
    return val;
  }, z.string())
  .transform((value) => {
    const date = new Date(value);
    return date.toISOString();
  });

export const DatetimeSchema = z.string().transform((value) => {
  const date = new Date(value);
  return date.toLocaleString();
});

export const ImageSchema = (requiredMessage?: string) => {
  if (requiredMessage) {
    return z
      .instanceof(File)
      .nullable()
      .refine((val) => val instanceof File, {
        message: requiredMessage,
      });
  }

  return z.instanceof(File).nullable();
};
