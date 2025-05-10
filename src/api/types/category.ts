import { z } from "zod";
import { CategoryCreateSchema, CategoryListSchema, CategorySchema, CategoryUpdateSchema } from "..";

export type Category = z.infer<typeof CategorySchema>;
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
export type CategoryList = z.infer<typeof CategoryListSchema>;