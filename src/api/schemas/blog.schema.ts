
import { z } from "zod";
import { UserProfileSchema } from "./user";
import { ApiResponseSchema, DatetimeSchema } from "./common";
import {GenreDomain} from "@/stores/blog/genre.store";
import Genre2Schema = GenreDomain.Genre2Schema;
import {BlogResponseListType} from "@/api";
const hasWindow = typeof window !== "undefined";

export const BlogBase = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long").max(20, "Title must be at most 100 characters long"),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters long").max(30, "Subtitle must be at most 30 characters long"),
    publishedAt: z.string(),
    image: hasWindow ?  z.instanceof(File).nullable(): z.any(),
    content: z.string().min(2, "Content must be at least 2 characters long").max(10000, "Content must be at most 10000 characters long"),
})

export const BlogSchema = z.object({
    id: z.number(),
    title: z.string(),
    subtitle: z.string(),
    author: UserProfileSchema,
    genre2Ids: z.array(z.number()),
    publishedAt: DatetimeSchema,
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        else return "/empty_img.png";
        }, z.string()),
    content: z.string(),
})
export const BlogListSchema = z.array(BlogSchema)


export const BlogResponseSchema = z.object({
    id: z.number(),
    title: z.string().nullish(),
    subtitle: z.string().nullish(),
    author: UserProfileSchema.nullish(),
    publishedAt: DatetimeSchema.nullish(),
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        else return "/empty_img.png";
    }, z.string()),
    genre2Ids: z.array(z.number()).nullish(),
    content: z.string().nullish()
})
export const BlogResponseSchemaList = z.array(BlogResponseSchema)
export const BlogPaginationResponseSchema = ApiResponseSchema(BlogResponseSchemaList)


export const BlogCreateSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long").max(20, "Title must be at most 100 characters long"),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters long").max(30, "Subtitle must be at most 30 characters long"),
    genreIds: z.array(z.number()).min(1, "At least one genre is required"),
    publishedAt: z.string(),
    image: hasWindow ?  z.instanceof(File).nullable(): z.any(),
    content: z.string().min(2, "Content must be at least 2 characters long").max(10000, "Content must be at most 10000 characters long"),
})

export const BlogUpdateSchema = BlogCreateSchema.extend({
    id: z.number(),
})

export const GenreSchema = z.object({
    id: z.number(),
    name: z.string(),
    genres: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
})

