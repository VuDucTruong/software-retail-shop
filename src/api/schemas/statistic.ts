import { z } from "zod";
import { DateSchema } from "./common";

export const TotalStatisticSchema = z.object({
  totalNewCustomers: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  averageOrderValue: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  revenue: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  totalOrders: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
});

export const OrderStatisticSchema = z.object({
  localDate: z.string(),
  pending: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  processing: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  completed: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
  failed: z.preprocess((val) => {
    if (val) return Number(val);
    return 0;
  }, z.number()),
});

export const StatisticQuerySchema = z.object({
    from: DateSchema,
    to: DateSchema,
}).partial();

