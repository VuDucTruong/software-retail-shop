import { z } from "zod";
import { CommentCreateSchema, CommentListSchema, CommentSchema, ReplySchema } from "@/api";

export type UserComment  = z.infer<typeof CommentSchema>;
export type Reply = z.infer<typeof ReplySchema>;
export type CommentList = z.infer<typeof CommentListSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;