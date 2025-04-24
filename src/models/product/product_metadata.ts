import { z } from "zod";

export const ProductMetadataScheme = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    imageUrl: z.string(),
    price: z.number(),
    originalPrice: z.number(),
})

export type ProductMetadata = z.infer<typeof ProductMetadataScheme>;