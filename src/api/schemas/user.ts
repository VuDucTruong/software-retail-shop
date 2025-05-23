import { z } from "zod";
import { ApiResponseSchema, DateSchema, DatetimeSchema, ImageSchema, PasswordSchema } from "./common";

export const UserProfileSchema = z.object({
    id: z.number(),
    fullName: z.preprocess((value) => {
        if(value) return value
        else return "Vô danh"
    } , z.string()),
    createdAt: DateSchema.nullable(),
    imageUrl: z.preprocess((value) => {
        if(value) return value
        else return "/empty_user.png"
    }, z.string()),
})

export const UserSchema = z.object({
    id: z.number(),
    enableDate: DateSchema.nullable(),
    disableDate: DateSchema.nullable(),
    createdAt: DatetimeSchema,
    deletedAt: DatetimeSchema.nullable(),
    isVerified: z.boolean(),
    role: z.string(),
    email: z.string().email(),
    profile: UserProfileSchema,
})

export const UserCreateSchema = z.object({
    email: z.string().email({message: "Email không hợp lệ"}),
    password: PasswordSchema,
    enableDate: DateSchema.nullable(),
    disableDate: DateSchema.nullable(),
    isVerified: z.boolean(),
    role: z.string().min(1, {message: "Vui lòng chọn vai trò"}),
    profile: z.object({
        avatar: ImageSchema(),
        fullName: z.string().min(2, "Full name must be at least 2 characters long").max(40, "Full name must be at most 40 characters long"),
    })
})


export const UserProfileUpdateSchema = z.object({
    id: z.number(),
    fullName: z.string().min(2, "Full name must be at least 2 characters long").max(40, "Full name must be at most 40 characters long"),
    image: ImageSchema(),
}).partial();

export const UserListSchema = ApiResponseSchema(z.array(UserSchema));