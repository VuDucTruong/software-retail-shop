
import { z } from "zod";
import { UserProfileSchema } from "./user";
import { ApiResponseSchema, DatetimeSchema } from "./common";

export const BlogSchema = z.object({
    id: z.number(),
    title: z.string(),
    subtitle: z.string(),
    author: UserProfileSchema,
    genres: z.array(z.string()),
    publishedAt: DatetimeSchema,
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        else return "/empty_img.png";
        }, z.string()),
    content: z.string(),
})

export const BlogCreateSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long").max(20, "Title must be at most 100 characters long"),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters long").max(30, "Subtitle must be at most 30 characters long"),
    genreIds: z.array(z.number()).min(1, "At least one genre is required"),
    publishedAt: z.string(),
    image: z.instanceof(File).nullable(),
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

export const BlogListSchema = ApiResponseSchema(z.array(BlogSchema));