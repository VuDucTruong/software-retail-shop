
import { z } from "zod";
import { ApiResponseSchema } from "../common";

export const ProductItemSchema = z.object({
    id: z.number(),
    productId: z.number(),
    productKey: z.string(),
    region: z.string().optional(),
})


export const ProductItemDetailSchema = z.object({
    id: z.number(),
    slug: z.preprocess((val) => {
        if (val) return val;
        return ""
    }, z.string()),
    name: z.string(),
    imageUrl: z.preprocess((val) => {
        if (val || val === "") return val;
        return "/empty_img.png"
        }, z.string()),
    represent: z.boolean(),
    price: z.number(),
    originalPrice: z.number(),
    productId: z.number(),
    productKey: z.string(),
    createdAt: z.string(),
    region: z.string(),
    used: z.boolean(),
})

export const ProductItemDetailListSchema = ApiResponseSchema(z.array(ProductItemDetailSchema));


export const ProductItemCreateSchema = z.object({
    productId: z.number().nullable(),
    productKey: z.string().nonempty(),
    region: z.string().nonempty(),
})