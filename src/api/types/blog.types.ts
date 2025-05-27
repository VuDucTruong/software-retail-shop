import {z} from "zod";
import {
    BlogCreateSchema,
    BlogListSchema, BlogPaginationSchema,
    BlogPaginationResponseSchema,
    BlogResponseSchema,
    BlogResponseSchemaList,
    BlogSchema,
    BlogUpdateSchema
} from "@/api";

export type BlogDomainType = z.infer<typeof BlogSchema>;
export type BlogDomainList = z.infer<typeof BlogListSchema>;

export type BlogCreateRequest = z.infer<typeof BlogCreateSchema>;
export type BlogUpdateRequest = z.infer<typeof BlogUpdateSchema>;
export type BlogResponseType = z.infer<typeof BlogResponseSchema>
export type BlogResponseListType = z.infer<typeof BlogResponseSchemaList>
export type BlogPaginationResponse = z.infer<typeof BlogPaginationResponseSchema>

export type BlogPagination = z.infer<typeof BlogPaginationSchema>