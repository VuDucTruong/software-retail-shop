import { z } from "zod";
import {
  ProductCreateSchema,
  ProductDescriptionSchema,
  ProductGroupCreateSchema,
  ProductGroupSchema,
  ProductGroupUpdateSchema,
  ProductItemSchema,
  ProductListSchema,
  ProductMetadataSchema,
  ProductSchema,
  ProductUpdateSchema,
} from "@/api";

export type Product = z.infer<typeof ProductSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type ProductItem = z.infer<typeof ProductItemSchema>;
export type ProductMetadata = z.infer<typeof ProductMetadataSchema>;
export type ProductDescription = z.infer<typeof ProductDescriptionSchema>;
export type ProductGroup = z.infer<typeof ProductGroupSchema>;
export type ProductGroupCreate = z.infer<typeof ProductGroupCreateSchema>;
export type ProductGroupUpdate = z.infer<typeof ProductGroupUpdateSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
