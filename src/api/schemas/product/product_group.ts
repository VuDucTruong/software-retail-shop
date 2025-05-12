import { z } from "zod";

export const ProductGroupSchema = z.object({
  id: z.number(),
    name: z.string(),
});

export const ProductGroupCreateSchema = z.object({
    name: z.string().min(3, { message: "Nhóm sản phẩm phải từ 3 kí tự trở lên" }),
})

export const ProductGroupUpdateSchema = z.object({
    id: z.number(),
    name: z.string().min(3, { message: "Nhóm sản phẩm phải từ 3 kí tự trở lên" }),
})