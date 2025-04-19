import { z } from "zod";

export const CategoryScheme = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    description: z.string(),
})


export const CategoryPreviewScheme = CategoryScheme.omit({
    imageUrl: true,
    description: true,
});

export type Category = z.infer<typeof CategoryScheme>;
export type CategoryPreview = z.infer<typeof CategoryPreviewScheme>;