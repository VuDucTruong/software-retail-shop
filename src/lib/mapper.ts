import { ProductScheme, ProductUpdateScheme } from "@/types/api/product/product";
import { z } from "zod";

// === Utility Function ===
export const convertProductToProductUpdate = (
    product: z.infer<typeof ProductScheme>
  ) => ProductUpdateScheme.parse({
    ...product,
    image: null,
    categories: product.categories.map(category => category.id),
  });