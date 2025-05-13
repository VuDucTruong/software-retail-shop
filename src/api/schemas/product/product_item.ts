import { create } from "domain";
import { z } from "zod";
import { ApiResponseSchema } from "../common";

export const ProductItemSchema = z.object({
    productId: z.number(),
    productKey: z.string(),
    region: z.string(),
})


export const ProductItemDetailSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
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