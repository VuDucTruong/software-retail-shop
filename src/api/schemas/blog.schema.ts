import {z} from "zod";
import {
    ApiResponseSchema,
    DatetimeNoFallbackSchema,
    DatetimeSchema,
    zArrayDefault,
    zNumDefault,
    zStrDefault
} from "./common";
import {UserProfileSchema} from "./user";

const hasWindow = typeof window !== "undefined";

export const BlogSchema = z.object({
    id: z.number(),
    title: z.string(),
    publishedAt: DatetimeSchema,
    deletedAt: DatetimeNoFallbackSchema.nullish(),
    approvedAt: DatetimeNoFallbackSchema.nullish(),
    subtitle: z.string(),
    author: UserProfileSchema,
    genre2Ids: z.array(z.number()),
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        else return "/empty_img.png";
    }, z.string()),
    content: z.string(),
})

export const BlogResponseSchema = z.object({
    id: z.number(),
    title: zStrDefault(''),
    subtitle: zStrDefault(''),
    author: UserProfileSchema.nullish(),
    publishedAt: DatetimeSchema,
    deletedAt: DatetimeNoFallbackSchema.nullish(),
    approvedAt: DatetimeNoFallbackSchema.nullish(),
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        else return "/empty_img.png";
    }, z.string()),
    genre2Ids: z.array(z.number()).nullish(),
    content: zStrDefault('')
})
export const BlogResponseSchemaList = z.array(BlogResponseSchema)
export const BlogPaginationResponseSchema = ApiResponseSchema(BlogResponseSchemaList)

export const BlogsGenre1Responses = zArrayDefault(z.object({
    id: zNumDefault(0),
    blogs: zArrayDefault(BlogResponseSchema, [])
}), [])

export const BlogCreateSchema = z.object({
    title: z.string().min(2, "Input.error_title_min").max(20, "Input.error_title_max"),
    subtitle: z.string().min(2, "Input.error_subtitle_min").max(30, "Input.error_subtitle_max"),
    genreIds: z.array(z.number()).min(1, "Input.error_genre_required"),
    publishedAt: z.string(),
    image: hasWindow ? z.instanceof(File).nullable() : z.any(),
    content: z.string().min(2, "Input.error_content_min").max(5000, "Input.error_content_max"),
})

export const BlogUpdateSchema = BlogCreateSchema.extend({
    id: z.number(),
})

