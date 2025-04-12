import { Package, TrendingDownIcon, TrendingUpIcon, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function CardSection() {
  const t = useTranslations();

  const cardData = [
    {
      title: t('total_revenue'),
      value: "$1,250.00",
      trend: "+12.5%",
    },
    {
      title: t('average_order_value'),
      value: "$1,250.00",
      trend: "+12.5%",
    },
    {
      title: t('total_new_customers'),
      value: "1,250",
      trend: "+12.5%",
      icon: <User2 className="size-5" />,
    },
    {
      title: t('total_orders'),
      value: "1,250",
      trend: "+12.5%",
      icon: <Package className="size-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {
        cardData.map((card, index) => (
          <Card className="@container/card" key={index}>
          <CardHeader className="relative border-b-0">
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl flex items-center gap-2 text-2xl font-semibold tabular-nums">
              {card.value}
              {card.icon}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                {card.trend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm border-t-0">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t('trending_up_by_x_this_month', {x: ''})} <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter>
        </Card>
        ))
      }
        
    </div>
  );
}
