import { z } from "zod";
import { UserProfileSchema, UserSchema } from "..";

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileSchema>;