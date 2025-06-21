
import { z } from "zod";
import { CategorySchema } from "../category";
import { ProductDescriptionSchema } from "./product_description";
import { ProductMetadataSchema } from "./product_metadata";
import { ApiResponseSchema, ImageSchema } from "../common";

// const hasWindow = typeof window !== "undefined";


// === Validation Messages ===
const messages = {
  required: {
    title: "Input.error_title_required",
    content: "Input.error_content_required",
    slug: "Input.error_slug_required",
    tags: "Input.error_tags_required",
    categories: "Input.error_categories_required", 
    image: "Input.error_image_required",
    groupId: "Input.error_group_id_required",
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
  id: z.number().optional(),
  slug: z.string(),
  name: z.string().min(3, { message: messages.name }),
  image: ImageSchema(messages.required.image),
  represent: z.boolean().default(true),
  price: z.number().gte(0, { message: messages.price }),
  originalPrice: z.number().gte(0, { message: messages.originalPrice }),
  categoryIds: z.array(z.number()).nonempty({ message: messages.required.categories }),
  tags: z.array(z.string()).nonempty({ message: messages.required.tags }),
  productDescription: ProductDescriptionSchema,
  groupId: z.number().nullable().refine((val) => val && val >= 0, {message: messages.required.groupId}),
});


const applyRefinement = (schema: typeof ProductValidation) => {
  return schema.superRefine((data, ctx) => {
    if (data.price > data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.priceComparison,
        path: ["price"],
      });
    }
  });
};


// Create
export const ProductCreateSchema = applyRefinement(ProductValidation)


// Update
export const ProductUpdateSchema = applyRefinement(ProductValidation)
  

export const ProductListSchema = ApiResponseSchema(z.array(ProductSchema));

/// TODO: REFACTOR THIS
export const ProductResponseSchema = z.object({
  id: z.number(),
  productDescription: ProductDescriptionSchema.nullish(),
  slug: z.string().nullish(),
  name: z.string().nullish(),
  imageUrl: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  favorite: z.boolean().nullish(),
  groupId: z.number().nullish(),
  price: z.number().nullish(),
  originalPrice: z.number().nullish(),
  quantity: z.number().nullish(),
  status: z.string().nullish(),
  // variants: ProductMetadataSchema,
})
export const ProductResponseSchemaList = z.array(ProductResponseSchema)
export const ProductResponsePage = ApiResponseSchema(ProductResponseSchemaList)
