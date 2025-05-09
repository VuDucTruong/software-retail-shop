import { z } from "zod";
import { CommentSchema, ReplySchema } from "@/api";

export type UserComment  = z.infer<typeof CommentSchema>;
export type Reply = z.infer<typeof ReplySchema>;