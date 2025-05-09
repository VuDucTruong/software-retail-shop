import { z } from "zod";

export const ProductItemSchema = z.object({
    productId: z.number(),
    productSlug: z.string(),
    productKey: z.string(),
    region: z.string(),
})