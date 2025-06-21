import {z} from "zod";
import {
  ProductCreateSchema,
  ProductDescriptionSchema,
  ProductGroupCreateSchema,
  ProductGroupSchema,
  ProductGroupUpdateSchema,
  ProductItemCreateSchema,
  ProductItemDetailListSchema,
  ProductItemDetailSchema,
  ProductItemSchema,
  ProductListSchema,
  ProductMetadataSchema,
  ProductResponseSchema,
  ProductSchema,
  ProductTrendSchema,
  ProductUpdateSchema,
  SimpleProductTrendSchema,
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
export type ProductItemDetail = z.infer<typeof ProductItemDetailSchema>;
export type ProductItemDetailList = z.infer<typeof ProductItemDetailListSchema>;
export type ProductItemCreate = z.infer<typeof ProductItemCreateSchema>;
export type ProductTrend = z.infer<typeof ProductTrendSchema>;
export type SimpleProductTrend = z.infer<typeof SimpleProductTrendSchema>;
export type ProductResponseType = z.infer<typeof ProductResponseSchema>

