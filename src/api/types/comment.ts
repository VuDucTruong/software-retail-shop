import { z } from "zod";
import { CommentCreateSchema, CommentListSchema, CommentSchema } from "@/api";

export type UserComment  = z.infer<typeof CommentSchema>;
export type CommentList = z.infer<typeof CommentListSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;