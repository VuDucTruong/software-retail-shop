import { z } from "zod";
import { ProductMetadataScheme } from "../schemas/product/product_metadata";

export const OrderDetailScheme = z.object({
    price: z.number(),
    quantity: z.number(),
    product: ProductMetadataScheme
})

export type OrderDetail = z.infer<typeof OrderDetailScheme>;