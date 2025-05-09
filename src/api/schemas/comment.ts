import { z } from "zod";

export const AuthorSchema = z.object({
    id: z.number(),
    fullName: z.string(),
    createdAt: z.string(),
    imageUrl: z.string(),
})


export const ReplySchema = z.object({
    id: z.number(),
    author: AuthorSchema,
    createdAt: z.string(),
    deletedAt: z.string().nullable(),
    content: z.string(), 
})

export const CommentSchema = ReplySchema.extend({
    replies: z.array(ReplySchema),
})