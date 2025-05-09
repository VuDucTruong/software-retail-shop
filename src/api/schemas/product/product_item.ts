import { z } from "zod";

export const ProductItemScheme = z.object({
    productId: z.number(),
    productSlug: z.string(),
    productKey: z.string(),
    region: z.string(),
})


export type ProductItem = z.infer<typeof ProductItemScheme>;