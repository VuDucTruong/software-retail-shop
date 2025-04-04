'use client'
import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";
import FavoriteProductItem from "@/components/wishlist/FavoriteProductItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function WishlistPage() {
  const t = useTranslations();
  const items = [
    {
      id: "1",
      title: "Product 1",
      tags: ["Tag 1", "Tag 2"],
      price: 100,
      image: "/banner.png",
      originalPrice: 150,
    },
    {
      id: "2",
      title: "Product 2",
      tags: ["Tag 3", "Tag 4"],
      price: 200,
      image: "/banner.png",
      originalPrice: 250,
    },
    // Add more items as needed
  ];


  const handleDelete = (id: string) => {
    toast.error(t("TOAST.wishlist_item_deleted"));
  }

  const handleAddToCart = (id: string) => {
    toast.success(t("TOAST.cart_item_added"));
  }

  return (
    <Card>
      <CardHeader>
        <h3>{t("my_favorites")}</h3>
        <p className="font-normal italic text-muted-foreground">{t("my_favorites_description")}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">

        {items.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center">
            <Image
              alt="Empty Wishlist"
              src="/empty-cart.png"
              width={300}
              height={300}
            />
            <div className="body-md italic regular">{t("empty_wishlist")}</div>
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <FavoriteProductItem key={item.id} {...item} onDelete={()=>{
                handleDelete(item.id);
              }} onAddToCart={()=>{
                handleAddToCart(item.id);
              }}/>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
