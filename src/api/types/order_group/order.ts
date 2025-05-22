import { z } from "zod";
import {
    OrderCreateSchema,
    OrderDetailCreateListSchema,
    OrderDetailCreateSchema,
    OrderDetailListSchema,
    OrderDetailSchema,
    OrderSchema
} from "@/api";

export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type OrderDetailList = z.infer<typeof OrderDetailListSchema>
export type OrderCreate = z.infer<typeof OrderCreateSchema>
export type OrderDetailCreateList = z.infer<typeof OrderDetailCreateListSchema>
export type OrderDetailCreate = z.infer<typeof OrderDetailCreateSchema>