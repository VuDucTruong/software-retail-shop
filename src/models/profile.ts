import { z } from "zod";

export const ProfileScheme = z.object({
    id: z.number(),
    fullName: z.string(),
    email: z.string(),
    imageUrl: z.string(),
    createAt: z.string(),
})

export type Profile = z.infer<typeof ProfileScheme>;