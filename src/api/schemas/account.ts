import { z } from "zod";
import { UserSchema } from "./user";
import { PasswordSchema } from "./common";



export const messages = {
    required: {
      email: "Input.error_email_empty",
      password: "Input.error_password_empty",
      fullName: "Input.error_fullname_empty",
      otp: "Input.error_otp_empty",
    },
    invalid: {
      email: "Input.error_email_format",
      password: "Input.error_password_format",
        fullName: "Input.error_fullname_format",
    },
    min: {
      email: "Input.error_email_min",
      password: "Input.error_password_min",
        fullName: "Input.error_fullname_min",
    },
    max: {
      email: "Input.error_email_max",
      password: "Input.error_password_max",
        fullName: "Input.error_fullname_max",
    },
    notMatch: {
      password: "Input.error_pass_not_match",
    },
  };

export const LoginRequestSchema = z.object({
  email: z
    .string({
      required_error: messages.required.email,
    })
    .min(6, {
      message: messages.min.email,
    })
    .max(40, {
      message: messages.max.email,
    })
    .email({
      message: messages.invalid.email,
    }),
  password: PasswordSchema,
});
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
})


export const RegisterRequestSchema = z.object({
    email: z.string({
        required_error: messages.required.email,
    }).email({
        message: messages.invalid.email,
    }).min(6, {
        message: messages.min.email,
    }).max(40, {
        message: messages.max.email,
    }),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    fullName: z.string({
        required_error: messages.required.fullName,
    }).min(2, {
        message: messages.min.fullName,
    }).max(40, {
        message: messages.max.fullName,
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: messages.notMatch.password,
    path: ["confirmPassword"],
})


export const ChangePasswordSchema = z.object({
  email: z.string().email(messages.invalid.email),
  otp: z.string().length(6 , messages.required.otp),
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
}).partial().refine((data) => data.password === data.confirmPassword, {
  message: messages.notMatch.password,
  path: ["confirmPassword"],
})