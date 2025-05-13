import { Category, CategoryUpdate } from "@/api";
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


export const convertCategoryUpdateToCategory = (update: CategoryUpdate , category: Category):Category => {
  return {
    ...category,
    name: update.name ?? category.name,
    description: update.description ?? category.description,
  };
}