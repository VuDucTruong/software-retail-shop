import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.number(),
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
    email: z.string().email(),
    profile: UserProfileSchema,
})


const UserProfileUpdateSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long").max(40, "Full name must be at most 40 characters long"),
    image: z.instanceof(File),
}).partial();