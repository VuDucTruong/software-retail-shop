import { z } from "zod";
import { CategoryScheme } from "./category";

export const ProductScheme = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    imageUrl: z.string(),
    price: z.number().gte(0,{message: "Price must be greater than or equal to 0"}), 
    originalPrice: z.number().gte(0,{message: "Original Price must be greater than or equal to 0"}), 
    model: z.string(),
    categories : z.array(CategoryScheme),
    variants: z.object({
        title: z.string(),
        list: z.array(z.object({
            id: z.number(),
            text: z.string(),
            slug: z.string(),
            isAvailable: z.boolean(),
        }))
    }),
    tags: z.array(z.string()),
    note: z.string(),
    description: z.array(z.object({
        title: z.string(),
        content: z.string(),
    })),
    stock: z.number(),
}).refine(data => (data.price <= data.originalPrice), {
    message: "Price must be less than or equal to original price",
    path: ['price'], // Points the error to the `price` field
  })


export type Product = z.infer<typeof ProductScheme>;
export type ProductCreate = Omit<Product, "id" | "stock" | "variants">;