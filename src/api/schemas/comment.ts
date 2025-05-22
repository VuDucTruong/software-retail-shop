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
    content: z.string().nullable(), 
})

export const CommentSchema = ReplySchema.extend({
    replies: z.preprocess((val) => {
        if(val) return val;
        return [];
    }, z.array(ReplySchema)).optional(),
})

export const CommentCreateSchema = z.object({
    productId: z.number(),
    content: z.string().min(1, { message: "Comment content is required" }),
    parentCommentId: z.number().optional(),
})

export const CommentListSchema = ApiResponseSchema(z.array(CommentSchema));