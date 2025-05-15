import { z } from "zod";
import { ApiResponseSchema } from "./common";

export const AuthorSchema = z.object({
    id: z.number(),
    fullName: z.string(),
    createdAt: z.string(),
    imageUrl: z.string().nullable(),
})


export const ReplySchema = z.object({
    id: z.number(),
    author: AuthorSchema,
    createdAt: z.string().transform((val) => new Date(val).toLocaleDateString()),
    deletedAt: z.string().nullable(),
    content: z.string(), 
})

export const CommentSchema = ReplySchema.extend({
    replies: z.array(ReplySchema),
})

export const CommentListSchema = ApiResponseSchema(z.array(CommentSchema));