import { z } from "zod";
import { CommentListSchema, CommentSchema, ReplySchema } from "@/api";

export type UserComment  = z.infer<typeof CommentSchema>;
export type Reply = z.infer<typeof ReplySchema>;
export type CommentList = z.infer<typeof CommentListSchema>;