import { z } from "zod";
import { PaymentSchema } from "@/api";


export type Payment = z.infer<typeof PaymentSchema>;