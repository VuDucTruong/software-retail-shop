import { OrderDetailList } from "@/api";
import { z } from "zod";

// fetch product by id first to ask for confirmation

export namespace CartMetaData {
    const LocalMetaSchema = z.map(z.number(),z.object({
        qty: z.number().positive(),
        name: z.string().default("")
    }))
    export type CartDomainList =OrderDetailList

    export type Local = z.infer<typeof LocalMetaSchema>;
    export type LocalKey = z.infer<typeof LocalMetaSchema._def.keyType>;
    export type LocalValue = z.infer<typeof LocalMetaSchema._def.valueType>;
}


