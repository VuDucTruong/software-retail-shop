import { z } from "zod";

const CommentScheme = z.object({
    id: z.number(),
    username: z.string(),
    content: z.string(),
    date: z.string(),
    productName: z.string(),
})


export type Comment = z.infer<typeof CommentScheme>;