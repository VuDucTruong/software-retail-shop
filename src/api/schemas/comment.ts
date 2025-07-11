import { z } from "zod";
import {ApiResponseSchema, DatetimeNoFallbackSchema, DatetimeSchema} from "./common";


export const AuthorSchema = z.object({
    id: z.number(),
    fullName: z.string(),
    createdAt: z.string(),
    imageUrl: z.string().nullable(),
})


export const CommentSchemaWithoutReplies = z.object({
    id: z.number(),
    author: AuthorSchema,
    role: z.preprocess((val) => {
      if(val) return val;
      return "CUSTOMER";
    }
    , z.string()),
    createdAt: DatetimeSchema,
    deletedAt: DatetimeNoFallbackSchema.nullable(),
    content: z.string().nullable(),
    parentCommentId: z.number().nullable().optional(),
    product: z.object({
      id: z.number(),
      name: z.string(),
      slug: z.preprocess((val) => {
        if (typeof val === "string") return val;
        return "";
      }, z.string()),
      imageUrl: z.string().nullable(),
      represent: z.boolean().nullable(),
      price: z.number().nullable(),
      originalPrice: z.number().nullable(),
    }).optional().nullable(),
})

export const CommentSchema = CommentSchemaWithoutReplies.extend({
    replies: z.array(CommentSchemaWithoutReplies).optional().nullable(),
})

export const CommentCreateSchema = z.object({
    productId: z.number(),
    content: z.string().min(1, { message: "Input.error_content_required" }),
    parentCommentId: z.number().optional(),
})

export const CommentListSchema = ApiResponseSchema(z.array(CommentSchema));