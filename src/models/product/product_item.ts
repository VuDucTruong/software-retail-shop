import { z } from "zod";

export const ProductItemScheme = z.object({
    productId: z.number(),
    productKey: z.string(),
    region: z.string(),
    active: z.boolean(),
})

export type ProductItem = z.infer<typeof ProductItemScheme>;