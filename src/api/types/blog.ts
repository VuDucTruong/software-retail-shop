import { z } from "zod";
import { BlogSchema } from "@/api";

export type Blog = z.infer<typeof BlogSchema>;