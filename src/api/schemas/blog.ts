
import { z } from "zod";

export const BlogSchema = z.object({
    id: z.number(),
    title: z.string(),
    genres: z.array(z.string()),
    publishAt: z.string(),
    imageUrl: z.string(),
    Content: z.string(),
})