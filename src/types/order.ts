import { convertPriceToVND } from "@/lib/currency_helper";
import { z } from "zod";
  
export const OrderTableItemScheme = z.object({
    id: z.string(),
    purchaser: z.string(),
    status: z.string(),
    total: z.number().transform((val) => convertPriceToVND(val)),
    recipent: z.string(),
    createdAt: z.string(),
})



export type OrderTableItem = z.infer<typeof OrderTableItemScheme>;