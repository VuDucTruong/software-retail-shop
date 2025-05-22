import { ApiResponseSchema, CategorySchema, ImageSchema, ProductDescriptionSchema, ProductItemSchema, ProductMetadataSchema } from "@/api";
import { z } from "zod";



// === Validation Messages ===
const messages = {
  required: {
    title: "Title is required",
    content: "Content is required",
    slug: "Product code is required",
    tags: "Tags are required",
    categories: "At least one category is required",
  },
  name: "Must be at least 3 characters",
  price: "Price must be greater than or equal to 0",
  originalPrice: "Original Price must be greater than or equal to 0",
  priceComparison: "Price must be less than or equal to original price",
  quantity: "quantity must be greater than 0",
};
export const ProductSchema = z.object({
  id: z.number(),
  slug: z.string(),
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
  productItems: z.array(ProductItemSchema).nullable(),
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
  image: ImageSchema("Product image is required"),
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
