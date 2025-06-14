import { useTranslations } from "next-intl";
import Image from "next/image";
import { IoMdTrendingUp } from "react-icons/io";
import { useClientProductStore } from "@/stores/cilent/client.product.store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import ProductItem from "../common/ProductItem";
import { Skeleton } from "../ui/skeleton";

export default function BestSellerSection() {
  const t = useTranslations();

  const [productTrend, getProductTrending] = useClientProductStore(
    useShallow((state) => [state.productTrend, state.getProductTrending])
  );

  useEffect(() => {
    getProductTrending(8);
  }, [getProductTrending]);

  return (
    <div className="bg-[#000d21] rounded-md flex flex-col gap-4">
      <div className="relative w-full h-[200px] ">
        <Image
          alt="Best seller background"
          className="rounded-md"
          fill
          src={"/best_seller.png"}
        />
      </div>
      <div className="flex flex-col gap-4 py-4 px-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center justify-center rounded-2xl px-8 py-2 border border-white">
            <IoMdTrendingUp className="size-8 text-red-500" />
            <h3 className="text-white">#{t("best_selling_products")}</h3>
          </div>
        </div>
        {productTrend && productTrend.length > 0 ? (
          <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
            {productTrend?.map((product) => (
              <ProductItem
                key={product.id}
                {...product}
                className="bg-accent shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 place-items-stretch gap-6 auto-rows-auto">
          {
            Array(8)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="h-[250px] rounded-md"
              />
            ))
          }</div>
        )}
      </div>
    </div>
  );
}
