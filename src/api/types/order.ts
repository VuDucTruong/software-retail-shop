import { z } from "zod";
import { OrderDetailSchema, OrderSchema } from "@/api";

export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;