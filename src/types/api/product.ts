import { z } from "zod";
import { CategoryPreviewScheme, CategoryScheme } from "./category";

export const DescriptionScheme = z.object({
  title: z.string().nonempty("Title is required"),
  content: z.string().nonempty("Content is required"),
})

export const ProductBaseScheme = z.object({
  id: z.number(),
  slug: z.string().nonempty("Slug is required"),
  name: z.string().regex(/^[a-zA-Z0-9\s]{3,}$/, {
    message: "Must be at least 3 characters, letters and numbers only.",
  }),
  imageUrl: z.string(),
  price: z
    .number()
    .gte(0, { message: "Price must be greater than or equal to 0" }),
  originalPrice: z
    .number()
    .gte(0, { message: "Original Price must be greater than or equal to 0" }),
  model: z.string().nonempty("Model is required"),
  categories: z.array(CategoryPreviewScheme).nonempty("At least one category is required"),
  tags: z.array(z.string()).nonempty("Tags are required"),
  note: z.string().min(1 , { message: "Note must be at least 1 character" }),
  description: z.array(
    DescriptionScheme
  ).nonempty("At least one description is required"),
  stock: z.number(),
});

const applyProductValidation = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodEffects<z.ZodObject<T>> => {
  return schema.superRefine((data, ctx) => {
    if (data.price > data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be less than or equal to original price",
        path: ["price"],
      });
    }
  });
};

export const ProductScheme = ProductBaseScheme.refine(
  (data) => data.price <= data.originalPrice,
  {
    message: "Price must be less than or equal to original price",
    path: ["price"],
  }
);

export const ProductCreateScheme = applyProductValidation(ProductBaseScheme.omit({
    id: true,
    imageUrl: true,
    categories: true,
  }).extend({
    image: z.instanceof(File , { message: "Image is required" }).nullable(),
    categories: z.array(z.number()).nonempty("At least one category is required"),
  }));

export const ProductUpdateScheme = applyProductValidation(ProductBaseScheme.omit({
    imageUrl: true,
    categories: true,
  }).extend({
    image: z.instanceof(File).nullable(),
    categories: z.array(z.number()).nonempty("At least one category is required"),
  }));

export const convertProductToProductUpdate = (
  product: z.infer<typeof ProductScheme>
) => {
  return ProductUpdateScheme.parse({
    ...product,
    image: null,
    categories: product.categories.map((category) => category.id),
  });
};
export type Product = z.infer<typeof ProductScheme>;
export type ProductCreate = z.infer<typeof ProductCreateScheme>;
export type ProductUpdate = z.infer<typeof ProductUpdateScheme>;
export type Description = z.infer<typeof DescriptionScheme>; 



const NewProductScheme = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  model: z.string(),
  categories: z.array(CategoryPreviewScheme),
  tags: z.array(z.string()),
  note: z.string(),
  description: z.array(DescriptionScheme),
  stock: z.number(),
})