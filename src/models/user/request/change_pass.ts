import { z } from "zod";

export const ChangePassScheme = z
  .object({
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirm_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });


export type ChangePassRequest = z.infer<typeof ChangePassScheme>;