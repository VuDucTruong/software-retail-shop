
import { z } from "zod";

export const ProductDescriptionSchema = z.object({
  description: z.string().nullable(),
  info: z.string().nullable(),
  platform: z.string().nullable(),
  policy: z.string().nullable(),
  tutorial: z.string().nullable(),
}).optional().nullable();
