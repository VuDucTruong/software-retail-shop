import { z } from "zod";


const messages = {
    product_group_name_min: "Input.error_product_group_name_min",
}

export const ProductGroupSchema = z.object({
  id: z.number(),
    name: z.string(),
});

export const ProductGroupCreateSchema = z.object({
    name: z.string().min(3, { message: messages.product_group_name_min }),
})

export const ProductGroupUpdateSchema = z.object({
    id: z.number(),
    name: z.string().min(3, { message: messages.product_group_name_min }),
})