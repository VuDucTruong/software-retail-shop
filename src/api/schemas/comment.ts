import { z } from "zod";

export const CommentSchema = z.object({
    id: z.number(),
    username: z.string(),
    content: z.string(),
    date: z.string(),
    productName: z.string(),
})