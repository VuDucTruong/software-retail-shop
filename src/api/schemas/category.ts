import { z } from "zod";
import { ApiResponseSchema } from "./common";

const messages = {
  required: {
    name: "INPUT.category_name_required",
    image: "INPUT.category_image_required",
    description: "INPUT.category_description_required",
  },
};
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  description: z.string(),
});

export const CategoryCreateSchema = z.object({
  name: z.string().nonempty(messages.required.name),
  image: z.instanceof(File, { message: messages.required.image }),
  description: z.string(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.extend({
  id: z.number(),
}).partial();


export const CategoryListSchema = ApiResponseSchema(z.array(CategorySchema));