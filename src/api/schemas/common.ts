import { z } from "zod";
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
