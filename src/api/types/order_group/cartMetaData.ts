import { OrderDetail } from "@/api";
import { z } from "zod";

// fetch product by id first to ask for confirmation

export namespace CartMetaData {
    const LocalMetaValueSchema = z.object({
        qty: z.number().positive(),
        name: z.string().default(""),
    })
    export const LocalMetaSchema = z.record(
        LocalMetaValueSchema
    );

    export type CartDomainList = OrderDetail[];

    export type Local = z.infer<typeof LocalMetaSchema>; // Record<string, { qty: number, name: string }>
    export type LocalKey = string;
    export type LocalValue = z.infer<typeof LocalMetaValueSchema>;
}
