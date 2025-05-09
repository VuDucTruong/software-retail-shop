import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    fullName: z.string(),
    createdAt: z.string().date(),
    imageUrl: z.string().nullable().default(""),
})

export const UserSchema = z.object({
    id: z.number(),
    enableDate: z.string().date(),
    disableDate: z.string().date(),
    createdAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
    isVerified: z.boolean(),
    role: z.string(),
    profile: UserProfileSchema,
})
