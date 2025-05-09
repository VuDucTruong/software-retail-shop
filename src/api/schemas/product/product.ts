import { CategorySchema, ProductDescriptionSchema, ProductItemScheme, ProductMetadataScheme } from "@/api";
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
  name: "Must be at least 3 characters, letters and numbers only.",
  price: "Price must be greater than or equal to 0",
  originalPrice: "Original Price must be greater than or equal to 0",
  priceComparison: "Price must be less than or equal to original price",
  quantity: "quantity must be greater than 0",
};
export const ProductScheme = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  represent: z.boolean(),
  price: z.number(),
  originalPrice: z.number(),
  categories: z.array(CategorySchema),
  tags: z.array(z.string()).default([]),
  productDescription: ProductDescriptionSchema,
  quantity: z.number(),
  status: z.string(),
  variants: z.array(ProductMetadataScheme),
  productItems: z.array(ProductItemScheme)
});

// === Schemas ===

export const ProductValidation = z.object({
  slug: z.string().nonempty({ message: messages.required.slug }),
  name: z.string().regex(/^[a-zA-Z0-9\s]{3,}$/, { message: messages.name }),
  image: z.instanceof(File, { message: "Image is required" }).nullable(),
  price: z.number().gte(0, { message: messages.price }),
  originalPrice: z.number().gte(0, { message: messages.originalPrice }),
  categories: z.array(z.number()).nonempty({ message: messages.required.categories }),
  tags: z.array(z.string()).nonempty({ message: messages.required.tags }),
  productDescription: ProductDescriptionSchema,
});


// Create
export const ProductCreateScheme = 
  ProductValidation.superRefine((data, ctx) => {
    if (data.price > data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.priceComparison,
        path: ["price"],
      });
    }
  })


// Update
export const ProductUpdateScheme = 
  ProductValidation.extend({
    id: z.number().default(0),
  }).superRefine((data, ctx) => {
    if (data.price > data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.priceComparison,
        path: ["price"],
      });
    }
  });

// === Types ===
export type Product = z.infer<ReturnType<typeof ProductScheme["partial"]>>;;
export type ProductCreate = z.infer<typeof ProductCreateScheme>;
export type ProductUpdate = z.infer<typeof ProductUpdateScheme>;
