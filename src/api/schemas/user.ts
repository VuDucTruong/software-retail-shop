import { z } from "zod";
import { ApiResponseSchema, DateSchema, DatetimeSchema, ImageSchema, PasswordSchema } from "./common";


const messages = {
    invalid: {
        email: "Input.error_email_format",
    },
    required: {
        role: "Input.error_role_required"
    },
    fullName_min: "Input.error_full_name_min",
    fullName_max: "Input.error_full_name_max",
}


export const UserProfileSchema = z.object({
    id: z.number(),
    fullName: z.preprocess((value) => {
        if(value) return value
        else return "Nameless"
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
    email: z.string().email({message: messages.invalid.email}),
    password: PasswordSchema,
    enableDate: DateSchema.nullable(),
    disableDate: DateSchema.nullable(),
    isVerified: z.boolean(),
    role: z.string().min(1, {message: messages.required.role}),
    profile: z.object({
        avatar: ImageSchema(),
        fullName: z.string().min(2, messages.fullName_min).max(40, messages.fullName_max),
    })
})


export const UserProfileUpdateSchema = z.object({
    id: z.number(),
    fullName: z.string().min(2, messages.fullName_min).max(40, messages.fullName_max),
    image: ImageSchema(),
}).partial();

export const UserListSchema = ApiResponseSchema(z.array(UserSchema));
