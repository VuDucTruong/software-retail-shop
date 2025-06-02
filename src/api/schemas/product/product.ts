import { ApiResponseSchema, CategorySchema, ImageSchema, ProductDescriptionSchema, ProductItemSchema, ProductMetadataSchema } from "@/api";
import { z } from "zod";

const hasWindow = typeof window !== "undefined";


// === Validation Messages ===
const messages = {
  required: {
    title: "Input.error_title_required",
    content: "Input.error_content_required",
    slug: "Input.error_slug_required",
    tags: "Input.error_tags_required",
    categories: "Input.error_categories_required", 
    image: "Input.error_image_required",
  },
  name: "Input.error_name_required_min_3",
  price: "Input.error_price_required_gt0",
  originalPrice: "Input.error_original_price_required_gt0",
  priceComparison: "Input.error_price_comparison",
};
export const ProductSchema = z.object({
  id: z.number(),
  slug: z.preprocess((value) => {
    if (value) return value;
    return "Empty Slug";
    }, z.string()),
  name: z.string(),
  imageUrl: z.preprocess((value) => {
    if(value) return value;
    return "/empty_img.png"
  }, z.string()),
  represent: z.boolean(),
  price: z.number(),
  originalPrice: z.number(),
  categories: z.array(CategorySchema).nullable(),
  tags: z.array(z.string()).default([]),
  productDescription: ProductDescriptionSchema,
  quantity: z.number(),
  status: z.string(),
  variants: z.array(ProductMetadataSchema).nullable(),
  groupId: z.number().nullable(),
  image: ImageSchema().optional(),
  favorite: z.preprocess((value) => {
    if (value) return value;
    return false;
  }, z.boolean()),
});

// === Schemas ===

export const ProductValidation = z.object({
  slug: z.string(),
  name: z.string().min(3, { message: messages.name }),
  image: ImageSchema(messages.required.image),
  represent: z.boolean().default(true),
  price: z.number().gte(0, { message: messages.price }),
  originalPrice: z.number().gte(0, { message: messages.originalPrice }),
  categoryIds: z.array(z.number()).nonempty({ message: messages.required.categories }),
  tags: z.array(z.string()).nonempty({ message: messages.required.tags }),
  productDescription: ProductDescriptionSchema,
  groupId: z.number().optional().nullable(),
});


const applyRefinement = (schema: z.ZodObject<any>) => {
  return schema.superRefine((data, ctx) => {
    if (data.price > data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.priceComparison,
        path: ["price"],
      });
    }
  });
}

// Create
export const ProductCreateSchema = applyRefinement(ProductValidation)


// Update
export const ProductUpdateSchema = applyRefinement(ProductValidation.extend({
    id: z.number(),
  }))
  

export const ProductListSchema = ApiResponseSchema(z.array(ProductSchema));
