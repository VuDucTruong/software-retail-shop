
import { z } from "zod";

const messages = {
  required: {
    description: "Description is required",
    info: "Info is required",
    policy: "Policy is required",
  },
}


export const DescriptionScheme = z.object({
  description: z.string().nonempty(messages.required.description),
  info: z.string().nonempty(messages.required.info),
  platform: z.string(),
  policy: z.string().nonempty(messages.required.policy),
  tutorial: z.string(),
});


export type ProductDescription = z.infer<typeof DescriptionScheme>;
