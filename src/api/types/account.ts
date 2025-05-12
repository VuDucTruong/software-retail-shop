import { z } from "zod";
import { ChangePasswordSchema, LoginRequestSchema, RegisterRequestSchema } from "..";


export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;