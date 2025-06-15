import {
    OrderCreateSchema,
    OrderDetailCreateSchema,
    // OrderDetailListSchema,
    OrderDetailSchema, OrderResponseSchema,
    OrderSchema, OrderStatusSchema
} from "@/api";
import { z } from "zod";

export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>
export type OrderDetailRequest = z.infer<typeof OrderDetailCreateSchema>
export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>
export type OrderDetailResponse = z.infer<typeof OrderDetailSchema>