import { z } from "zod";
import { UserProfileSchema, UserProfileUpdateSchema, UserSchema } from "..";

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;