import { z } from "zod";
import { ChangepasswordRequestSchema, LoginRequestSchema, RegisterRequestSchema } from "..";


export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type ChangePasswordRequest = z.infer<typeof ChangepasswordRequestSchema>;