import {z} from "zod";
import {
    UserCreateSchema,
    UserListSchema,
    UserProfileDetailedSchema,
    UserProfileSchema,
    UserProfileUpdateSchema,
    UserSchema
} from "..";

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserProfileDetailed = z.infer<typeof UserProfileDetailedSchema>

export const USER_PROFILE_DETAILED_FALL_BACK: UserProfileDetailed = {
    id: 0,
    imageUrl: 'empty_img.png',
    createdAt: new Date().toISOString(),
    fullName: "Anonymous",
    email: "unknown@gmail",
    accountId: 0
}