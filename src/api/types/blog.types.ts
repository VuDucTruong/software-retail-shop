import {z} from "zod";
import {
    BlogCreateSchema,
    BlogResponseSchema,
    BlogSchema,
    BlogUpdateSchema,
    USER_PROFILE_DETAILED_FALL_BACK
} from "@/api";
import {getDateLocal} from "@/lib/date_helper";

export type BlogDomainType = z.infer<typeof BlogSchema>;

export type BlogCreateRequest = z.infer<typeof BlogCreateSchema>;
export type BlogUpdateRequest = z.infer<typeof BlogUpdateSchema>;
export type BlogResponseType = z.infer<typeof BlogResponseSchema>
// export type BlogPaginationResponse = z.infer<typeof BlogPaginationResponseSchema>
// export type BlogPagination = z.infer<typeof BlogPaginationSchema>
export const BLOG_FALL_BACK: BlogDomainType = {
    id: 0,
    genre2Ids: [],
    publishedAt: getDateLocal(),
    author: USER_PROFILE_DETAILED_FALL_BACK,
    content: "",
    subtitle: "",
    title: "",
    imageUrl:  "/empty_img.png",
    deletedAt: null
}