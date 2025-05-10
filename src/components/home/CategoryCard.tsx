import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Category } from "@/api";

const sampleCategoryList:Category[] = []

export default function CategoryCard() {
  const t = useTranslations();
  return (
    <Card className="min-w-[200px] max-w-[300px]">
      <CardHeader>
        <CardTitle>{t("Category")}</CardTitle>
      </CardHeader>
      <CardContent>
        {sampleCategoryList.map((category) => (
          <div key={category.id} className="flex items-center mb-4 cursor-pointer hover:text-primary hover:opacity-80">
            <img
              src={category.imageUrl ?? "/empty_img.png"}
              alt={category.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
