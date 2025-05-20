"use client";
import { useTranslations } from "next-intl";
import ProductItem from "@/components/common/ProductItem";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Product } from "@/api";
import { Skeleton } from "../ui/skeleton";

type HomeProductSectionProps = {
  title: string;
  onMoreClick: () => void;
  data: Product[];
  isLoading?: boolean;
};

export default function HomeProductSection(props: HomeProductSectionProps) {
  const t = useTranslations();
  const { title, onMoreClick, data, isLoading } = props;
  return (
    <Card>
      <CardContent>
        <div className="flex flex-row justify-between mb-6 items-center">
          <div>
            <h3>{title}</h3>
          </div>
          <Button variant={"link"} onClick={onMoreClick}>{t("see_more")}</Button>
        </div>
        {/* List item */}
        {
          isLoading ? (<div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {Array.from({length: 8}).map((item, index) => (
            <Skeleton
              key={index}
              className="h-[200px] w-full rounded-sm" />
          ))}
        </div>) : (<div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {data.map((item, index) => (
            <ProductItem
              key={index}
              product={item}
            />
          ))}
        </div>)
        }
      </CardContent>
    </Card>
  );
}
