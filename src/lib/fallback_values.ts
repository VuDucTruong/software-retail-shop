import {UserProfile} from "@/api";

export const fallbackProfile : UserProfile = {
    id: -1,
    fullName: 'anonymous',
    createdAt: new Date().toISOString(),
    imageUrl: 'empty_user.png'
}
