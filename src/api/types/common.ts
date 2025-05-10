import { z } from "zod";
import { QueyParamsSchema } from "@/api";

export type QueryParams = z.infer<typeof QueyParamsSchema>;