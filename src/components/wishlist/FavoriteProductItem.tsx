import { Product } from "@/api";
import CommonPriceItem from "@/components/common/CommonPriceItem";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsCartXFill } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "../ui/button";

type FavoriteProductItemProps = {
  product: Product;
  onDelete: () => void;
  onAddToCart: () => void;
};

export default function FavoriteProductItem(props: FavoriteProductItemProps) {
  const { product, onDelete, onAddToCart } = props;
  const t = useTranslations();
  const router = useRouter();
  const handleSelectedItem = () => {
    router.push(`/product/${product.slug}`);
  };
  return (
    <div className="relative w-full">
      <Button variant={"destructive"} size={"icon"} onClick={onDelete} className="absolute cursor-pointer z-[51] -right-1 -top-2 rounded-full !p-0"><BsCartXFill /></Button>
      <div className="flex flex-col border border-border shadow-md rounded-md">
      {/* Product Image */}
      <div className="relative w-full aspect-[2/1]">
        <Image
          alt={product.name ?? "Product Image"}
          src={product.imageUrl}
          fill
          className="object-contain "
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-start flex-1 px-4 py-2 border-t border-border">
        <div className="w-full">
          <h4
            className="hover:underline font-medium cursor-pointer text-lg"
            onClick={handleSelectedItem}
          >
            {product.name}
          </h4>
          <div className="text-muted-foreground text-sm">
            {product.tags.join(", ")}
          </div>
          <CommonPriceItem
            originalPrice={product.originalPrice}
            price={product.price}
          />
        </div>

        <div className="flex-1 w-full flex items-end justify-end">
          <Button variant={"link"} className="!px-0" onClick={onAddToCart}>
            <FaCartPlus className="size-6 " />
            {t("add_to_cart")}
          </Button>
        </div>
      </div>
    </div>
    </div>
    
  );
}
