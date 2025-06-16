import { z } from "zod";

export const ProductMetadataSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.preprocess((value) => {
        if (value) return value;
        return "Empty Slug";
    }, z.string()),
    imageUrl: z.string().nullable(),
    price: z.number(),
    originalPrice: z.number(),
});

export const ProductTrendSchema = z.object({
    id: z.number(),
    slug: z.preprocess((value) => {
        if (value) return value;
        return "";
        }, z.string()),
    name: z.string(),
    imageUrl: z.preprocess((value) => {
        if (value) return value;
        return "/empty_img.png";
        }, z.string()),
    quantity: z.number(),
    price: z.number(),
    originalPrice: z.number(),
    totalSold: z.number(),
    represent: z.boolean().optional(),
})

export const SimpleProductTrendSchema = z.object({
    saleCount: z.number(),
    product: z.object({
        id: z.number(),
        name: z.string(),
    })
})