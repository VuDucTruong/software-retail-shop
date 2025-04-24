import { z } from "zod";
import { DescriptionScheme } from "./product_description";
import { CategoryScheme } from "../category";

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
  stock: "Stock must be greater than 0",
};
export const ProductScheme = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  categories: z.array(CategoryScheme),
  tags: z.array(z.string()),
  productDescription: DescriptionScheme,
  stock: z.number(),
  
});

// === Schemas ===

export const ProductValidation = z.object({
  id: z.number(),
  slug: z.string().nonempty(messages.required.slug),
  name: z.string().regex(/^[a-zA-Z0-9\s]{3,}$/, { message: messages.name }),
  imageUrl: z.string(),
  price: z.number().gte(0, { message: messages.price }),
  originalPrice: z.number().gte(0, { message: messages.originalPrice }),
  categories: z.array(CategoryScheme).nonempty(messages.required.categories),
  tags: z.array(z.string()).nonempty(messages.required.tags),
  productDescription: DescriptionScheme,
  stock: z.number().gt(0, { message: messages.stock }),

}).superRefine((data, ctx) => {
  if (data.price > data.originalPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: messages.priceComparison,
      path: ["price"],
    });
  }
});

// === Product Create / Update Common Shape ===
const FileShape = {
  image: z.instanceof(File, { message: "Image is required" }).nullable(),
};

// Create
export const ProductCreateScheme = 
  ProductScheme
    .omit({ id: true, imageUrl: true })
    .extend(FileShape)


// Update
export const ProductUpdateScheme = 
  ProductScheme
    .omit({ imageUrl: true})
    .extend(FileShape)

// === Types ===
export type Product = z.infer<ReturnType<typeof ProductScheme["partial"]>>;;
export type ProductCreate = z.infer<typeof ProductCreateScheme>;
export type ProductUpdate = z.infer<typeof ProductUpdateScheme>;
