import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useClientCategoryState } from "@/stores/cilent/client.category.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

export default function CategoryCard() {
  const t = useTranslations();
  const router = useRouter();
  
  const categories = useClientCategoryState((state) => state.categories);
  const handleCategoryClick = (id: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("categoryId", id.toString());
    searchParams.set("page", "0");
    searchParams.set("sort", "id,asc");
    router.push(`/search?${searchParams.toString()}`);
  }
  if (!categories) {
    return (
      <Card className="min-w-[200px] max-w-[300px]">
        <CardHeader>
          <CardTitle>{t("Category")}</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center mb-4 gap-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="w-[100px] h-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-[200px] max-w-[300px]">
      <CardHeader>
        <CardTitle>{t("Category")}</CardTitle>
      </CardHeader>
      <CardContent>
        {categories?.data.slice(0,5).map((category) => (
          <div
            onClick={() => {
              handleCategoryClick(category.id);
            }}
            key={category.id}
            className="flex items-center mb-4 cursor-pointer hover:text-primary hover:opacity-80 gap-2"
          >
            <div className="relative size-10 border-border border rounded-full overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="100%"
                className="object-cover p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
