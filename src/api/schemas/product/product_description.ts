
import { z } from "zod";

export const ProductDescriptionSchema = z.object({
  description: z.string(),
  info: z.string(),
  platform: z.string(),
  policy: z.string(),
  tutorial: z.string(),
});
