import { z } from "zod";
import { CommentSchema } from "..";

export type Comment  = z.infer<typeof CommentSchema>;