import { z } from "zod";




export const ProfileResponse = z.object({
    id: z.number(),
    fullName: z.string(),
    email: z.string(),
    imageUrl: z.string().nullable(),
    createdAt: z.string().nullable(),
})


export const ProfileScheme = z.object({
    id: z.number(),
    fullName: z.string(),
    email: z.string(),
    imageUrl: z.string(),
    createdAt: z.string(),
})

export type Profile = z.infer<typeof ProfileScheme>;