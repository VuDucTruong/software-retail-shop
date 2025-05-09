import { z } from "zod";

export const ErrorScheme = z.object({
    path: z.string(),
    code: z.number(),
    message: z.string(),
    data: z.any(),
}).partial()

export type Error = z.infer<typeof ErrorScheme>;