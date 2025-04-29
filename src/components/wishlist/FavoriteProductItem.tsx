import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { FaCartArrowDown, FaCartPlus } from "react-icons/fa";
import { IoHeartDislike } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { GoHeartFill } from "react-icons/go";
import { Button } from "../ui/button";
import CommonPriceItem from "@/components/common/CommonPriceItem";
import { useRouter } from "next/navigation";

type FavoriteProductItemProps = {
  id: string;
  title: string;
  tags: string[];
  price: number;
  image: string;
  originalPrice: number;
  onDelete: () => void;
  onAddToCart: () => void;
};

export default function FavoriteProductItem(props: FavoriteProductItemProps) {
  const {
    id,
    title,
    tags,
    price,
    image,
    originalPrice,
    onDelete,
    onAddToCart,
  } = props;
  const t = useTranslations();
  const router = useRouter();
  const handleSelectedItem = () => {
    router.push(`/${id}`);
  };
  return (
    <li className="flex flex-row items-center gap-4 p-4">
      {/* Product Image */}
      <div className="relative w-[270px] aspect-[2/1]">
        <Image
          alt={title}
          src={image}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col self-stretch items-start flex-1">
        <div>
          <h4 className="hover:underline font-bold cursor-pointer text-lg" onClick={handleSelectedItem}>
            {title}
          </h4>
          <div className="text-muted-foreground text-sm">{tags.join(", ")}</div>
        </div>

        <div

          className="text-primary hover:underline mt-auto flex gap-2 items-center cursor-pointer font-medium"
          onClick={onAddToCart}
        >
          <FaCartPlus className="size-6"/>
          {t("add_to_cart")}
        </div>
      </div>

      {/* Price */}
      <CommonPriceItem originalPrice={originalPrice} price={price} />

      {/* Remove btn */}
      <Button onClick={onDelete} variant={"destructive"}>
        <RiDeleteBin6Fill className="size-5" />
      </Button>
    </li>
  );
}
