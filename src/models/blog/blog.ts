import { Content } from "next/font/google";
import { title } from "process";
import { z } from "zod";

export const BlogScheme = z.object({
    id: z.number(),
    title: z.string(),
    genres: z.array(z.string()),
    publishAt: z.string(),
    imageUrl: z.string(),
    Content: z.string(),
})