import { profile } from "console";
import { boolean, number, string, z } from "zod";
import { ProfileScheme } from "../profile";

export const UserResponse = z.object({
    id: number(),
    enableDate: string().nullable(),
    disableDate: string().nullable(),
    createdAt: string().nullable(),
    deletedAt: string().nullable(),
    isVerified: boolean(),
    role: string(),
    profile: ProfileScheme
})


export const UserScheme = z.object({
    id: number(),
    disableDate: string(),
    createdAt: string(),
    role: string(),
    isActive: boolean(),
    profile: ProfileScheme
})



export type User = z.infer<typeof UserScheme>
