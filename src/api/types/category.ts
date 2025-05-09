import { z } from "zod";
import { CategoryCreateSchema, CategorySchema, CategoryUpdateSchema } from "..";

export type Category = z.infer<typeof CategorySchema>;
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;