
import { ProductSchema, ProductUpdateSchema } from "@/api/schemas/product/product";
import { z } from "zod";

// === Utility Function ===
export const convertProductToProductUpdate = (
    product: z.infer<typeof ProductSchema>
  ) => ProductUpdateSchema.parse({
    ...product,
    image: null,
    categories: product.categories?.map(category => category.id),
  });





