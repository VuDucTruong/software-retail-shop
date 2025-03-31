"use client";
import { useTranslations } from "next-intl";
import ProductItem from "../ProductItem";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";

type HomeProductSectionProps = {
  title: string;
  onMoreClick: () => void;
};

export default function HomeProductSection(props: HomeProductSectionProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardContent>
        <div className="flex flex-row justify-between mb-6 items-center">
          <div>
            <h3>{props.title}</h3>
          </div>
          <Button variant={"link"}>{t("see_more")}</Button>
        </div>
        {/* List item */}
        <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductItem
              key={index}
              title="Product title"
              originalPrice={100000}
              price={80000}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
