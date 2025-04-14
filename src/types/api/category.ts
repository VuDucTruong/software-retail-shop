import { z } from "zod";

export const CategoryScheme = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
})


export type Category = z.infer<typeof CategoryScheme>;