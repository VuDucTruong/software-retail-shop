"use client";
import OrderTable from "@/components/orders/OrderTable";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sampleOrderItems } from "@/config/sampleData";
import { CustomerOrderItem } from "@/types/customer_order_item";
import { useTranslations } from "next-intl";
import OrderDetailItem from "@/components/orders/OrderDetaiItem";
import { useParams } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
import SimpleTable from "@/components/SimpleTable";

export default function OrderDetailPage() {
  const params = useParams();
  const { id } = params;
  const t = useTranslations();

  const cols = [
    { header: t("order_information"), accessorKey: "order_info" },
    { header: "", accessorKey: "data" },
  ];

  const data = [
    { order_info: t("order_id"), data: id },
    { order_info: t("create_date"), data: "2023-10-01" },
    { order_info: t("order_status"), data: "Completed" },
    { order_info: t("recipient_email"), data: "Credit Card" },
    {
      order_info: t("total_product_value"),
      data: "123 Main St, City, Country",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex justify-between"> 
          <div>
            <h3>
              {t("order_detail")} #{id}
            </h3>
            <p className="text-sm font-normal text-muted-foreground">
              {t("order_detail_description")}
            </p>
          </div>
          <Button variant={"outline"} className="flex items-center gap-2">
            <FaCartPlus />
            {t("buy_product_again")}
          </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h4>{t("order_information")}</h4>
        {/* Order Info */}
        <SimpleTable columns={cols} data={data} />
      </CardContent>

      <CardFooter className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
        {Array.from({ length: 10 }).map((_, index) => (
          <OrderDetailItem key={index} />
        ))}
      </CardFooter>
    </Card>
  );
}
