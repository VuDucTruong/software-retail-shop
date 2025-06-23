import { z } from "zod";
import { ApiResponseSchema, ImageSchema } from "./common";

const messages = {
  required: {
    name: "Input.error_name_required_min_3",
    image: "Input.error_image_required",
  },
};
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.preprocess((val) => {
    if(val) return val;
    return "/empty_img.png"
  } , z.string()),
  description: z.string(),
  deletedAt: z.string().nullish(),
});

export const CategoryCreateSchema = z.object({
  name: z.string().nonempty(messages.required.name),
  image: ImageSchema(messages.required.image),
  description: z.string(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.extend({
  id: z.number(),
}).partial();


export const CategoryListSchema = ApiResponseSchema(z.array(CategorySchema));