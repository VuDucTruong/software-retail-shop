"use client";
import SearchPagination from "@/components/search/SearchPagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FavoriteProductItem from "@/components/wishlist/FavoriteProductItem";
import { useFavouriteToast } from "@/hooks/use-favourite-toast";
import { useClientFavouriteStore } from "@/stores/cilent/client.favourite.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function WishlistPage() {
  const t = useTranslations();

  const [products, getFavouriteProducts, updateProductFavourite,status,lastAction,error] =
    useClientFavouriteStore(
      useShallow((state) => [
        state.products,
        state.getFavouriteProducts,
        state.updateProductFavourite,
        state.status,
        state.lastAction,
        state.error,
      ])
    );

  useEffect(() => {
    getFavouriteProducts({
      pageRequest: {
        page: 0,
        size: 9,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });
  }, []);

  const handleDelete = (id: number) => {
    updateProductFavourite(id, false);
  };

  const handleAddToCart = (id: number) => {
    toast.success(t("Need to be implemented"));
  };

  useFavouriteToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  return (
    <Card>
      <CardHeader>
        <h3>{t("my_favorites")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("my_favorites_description")}
        </p>
      </CardHeader>

      {products === null ? (
        <CardContent className="flex items-center justify-center">
          <Skeleton className="w-full h-50" />
        </CardContent>
      ) : (
        <CardContent className="flex flex-col gap-4">
          {products?.data.length === 0 ? (
            <div className="flex flex-col gap-4 justify-center items-center">
              <Image
                alt="Empty Wishlist"
                src="/empty-cart.png"
                width={300}
                height={300}
              />
              <div className="body-md italic regular">
                {t("empty_wishlist")}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SearchPagination
                currentPage={products?.currentPage ?? 1}
                totalPages={products?.totalPages ?? 1}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products?.data.map((item) => (
                  <FavoriteProductItem
                    key={item.id}
                    product={item}
                    onDelete={() => {
                      handleDelete(item.id);
                    }}
                    onAddToCart={() => {
                      handleAddToCart(item.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
