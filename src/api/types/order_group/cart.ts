import {Product} from "@/api";
import {z} from "zod";

// fetch product by id first to ask for confirmation
const IdListSchema = z.array(z.number().positive())
export type ProductIdsList = z.infer<typeof IdListSchema>


export namespace Cart {
    const LocalMetaSchema = z.map(z.number(),z.object({
        qty: z.number().positive(),
        name: z.string().default("")
    }))

    export type Local = z.infer<typeof LocalMetaSchema>;
    export type LocalKey = z.infer<typeof LocalMetaSchema._def.keyType>;
    export type LocalValue = z.infer<typeof LocalMetaSchema._def.valueType>;
}


export type Cart = {
    id: number;
    product: Product
    quantity: number;
}


export type CartCreate = {
    id: number;
    product_id: number;
    quantity: number;
}
