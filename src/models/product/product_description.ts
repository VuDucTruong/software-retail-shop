
import { z } from "zod";

export const DescriptionScheme = z.object({
  description: z.string(),
  info: z.string(),
  platform: z.string(),
  policy: z.string(),
  tutorial: z.string(),
});


export type ProductDescription = z.infer<typeof DescriptionScheme>;
