import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertPriceToVND } from "@/lib/currency_helper";
import { formatNumberWithDots } from "@/lib/utils";
import { useDashboardStore } from "@/stores/dashboard.store";
import { Package, TrendingUpIcon, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";

export default function CardSection() {
  const t = useTranslations();

  const [totalStatistic, getTotalStatistic, query] = useDashboardStore(
    useShallow((state) => [state.totalStatistic, state.getTotalStatistic, state.queryParams])
  );

  useEffect(() => {
    getTotalStatistic(query);
  }, [getTotalStatistic,query]);

  const cardData = [
    {
      title: t("total_revenue"),
      value: convertPriceToVND(totalStatistic?.revenue || 0),
    },
    {
      title: t("average_order_value"),
      value: convertPriceToVND(totalStatistic?.averageOrderValue || 0),
    },
    {
      title: t("total_new_customers"),
      value: formatNumberWithDots(totalStatistic?.totalNewCustomers || 0),
      icon: <User2 className="size-5" />,
    },
    {
      title: t("total_orders"),
      value: formatNumberWithDots(totalStatistic?.totalOrders || 0),
      icon: <Package className="size-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {totalStatistic === null ? (
        <>
          {
            cardData.map((_, index) => (
              <Skeleton key={index} className="h-[116px]"/>
            ))
          }
        </>
      ) : (
        <>
          {cardData.map((card, index) => (
            <Card className="@container/card" key={index}>
              <CardHeader className="relative border-b-0">
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl flex items-center gap-2 text-2xl font-semibold tabular-nums">
                  {card.value}
                  {card.icon}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
