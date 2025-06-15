import { z } from "zod";
import { TotalStatisticSchema, OrderStatisticSchema, StatisticQuerySchema } from "../schemas/statistic";

export type TotalStatistic = z.infer<typeof TotalStatisticSchema>;
export type OrderStatistic = z.infer<typeof OrderStatisticSchema>;
export type StatisticQuery = z.infer<typeof StatisticQuerySchema>
