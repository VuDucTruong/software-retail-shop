import {
    OrderCreateSchema,
    OrderDetailListSchema,
    OrderDetailSchema, OrderResponseSchema,
    OrderSchema
} from "@/api";
import { z } from "zod";

export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type OrderDetailList = z.infer<typeof OrderDetailListSchema>
export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>
