import { z } from "zod";
import { BlogCreateSchema, BlogListSchema, BlogSchema, BlogUpdateSchema, GenreSchema } from "@/api";

export type Blog = z.infer<typeof BlogSchema>;
export type BlogCreate = z.infer<typeof BlogCreateSchema>;
export type BlogUpdate = z.infer<typeof BlogUpdateSchema>;
export type BlogList = z.infer<typeof BlogListSchema>;
export type Genre = z.infer<typeof GenreSchema>;