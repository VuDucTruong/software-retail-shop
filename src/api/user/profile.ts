import { number, string, z } from "zod";

export const ProfileScheme = z.object({
    id: number(),
    email: string(),
    fullName: string(),
    createdAt: string(),
    imageUrl: string(),
})


export type UserProfile = z.infer<typeof ProfileScheme>