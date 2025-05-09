import { z } from "zod";

const messages = {
    required: {
        name: "Name is required",
        image: "Image is required",
        description: "Description is required",
    },
}


export const CategoryScheme = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    description: z.string(),
})

export const CategoryCreateScheme = z.object({
    name: z.string().nonempty(messages.required.name),
    image: z.instanceof(File, { message: messages.required.image }),
    description: z.string(),
})

export const CategoryUpdateScheme = z.object({
    id: z.number(),
    name: z.string().nonempty(messages.required.name),
    image: z.instanceof(File).nullable(),
    description: z.string(),
})



export type Category = z.infer<typeof CategoryScheme>;
export type CategoryCreate = z.infer<typeof CategoryCreateScheme>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateScheme>;