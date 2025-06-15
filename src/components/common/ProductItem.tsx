import { Product } from "@/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import DiscountItem from "./DiscountItem";
import { ReactNode, useRef, useState } from "react";
import { CartLocal } from "@/stores/order/cart.store";
import { useShallow } from "zustand/shallow";

type ProductItemProps = {
  product: Product;
  className?: string;
};

function LongPressButton({
  onLongPress,
  children,
}: {
  onLongPress: () => void;
  children: React.ReactNode;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(150);

  const start = () => {
    speedRef.current = 180;
    onLongPress(); // initial call immediately
    intervalRef.current = setInterval(() => {
      onLongPress();
      // speed up interval down to a min of 50ms
      if (speedRef.current > 60) speedRef.current -= 60;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(onLongPress, speedRef.current);
      }
    }, speedRef.current);
  };

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div
      onMouseDown={start}
      onTouchStart={start}
      onMouseUp={clear}
      onMouseLeave={clear}
      onTouchEnd={clear}
      className="cursor-pointer select-none"
    >
      {children}
    </div>
  );
}

export default function ProductItem(props: ProductItemProps) {
  const { product } = props;
  const convertedPrice = convertPriceToVND(product.price);

  const [count, setCount] = useState<number>(0);
  const [addItem, subtractItem] = CartLocal.useStore(useShallow(s => [
    s.setItem, s.subtractItem,
  ]))

  const convertedOriginalPrice = convertPriceToVND(product.originalPrice);

  const discountPercentage = calcDiscountPercentage(
    product.price,
    product.originalPrice
  );
  const router = useRouter();
  const handleClick = () => {
    router.push("/product/" + product.slug);
  };
  const handlePlus = () => {
    setCount(c => Math.max(c - 1, 0));
    if(count > 0)
      addItem(product.id,1);
  }
  const handleMinus = () => {
    setCount(c => Math.max(c - 1, 0));
    if(count<0)
      subtractItem(product.id,1)
  }


  return (
    <Card
      className={cn(
        "select-none",
        props.className
      )}
    >
      <CardTitle
        className="p-0 gap-2 bg-transparent hover:opacity-70 cursor-pointer"
        onClick={handleClick}>
        <figure className="relative h-36">
          <Image
            className="rounded-sm object-fill"
            fill
            sizes="100%"
            src={product.imageUrl}
            alt="Product image"
          />
        </figure>
      </CardTitle>
      <LongPressButton onLongPress={handlePlus}>
        <div className="absolute ml-[-8px] left-0 bottom-[30%] cursor-pointer" style={{ zIndex: 10, fontSize: 25 }}>
          <FaCircleMinus color="red" />
        </div>
      </LongPressButton>
      <LongPressButton onLongPress={handleMinus}>
        <div className="absolute mr-[-8px] right-0 bottom-[30%] cursor-pointer" style={{ zIndex: 10, fontSize: 25 }}>
          <FaCirclePlus color="red" />
        </div>
      </LongPressButton>
      {
        count > 0 ? <div
          className="absolute mt-[-3px] top-0 right-[50px] flex items-center gap-1"
          style={{ zIndex: 20, fontSize: 25, color: "#2563EB" }}>
          +{count}
          <FaCartPlus />
        </div> : null
      }
      <div className="absolute ml-[-8px] top-0 right-0" style={{ zIndex: 10, fontSize: 25 }}>
        <DiscountItem discountPercentage={discountPercentage} />
      </div>
      <CardContent className="px-2 pb-2 cursor-pointer" onClick={handleClick}>

        <div className="text-center">{product.name}</div>
        <div className="flex gap-4 justify-around ">
          <div className="text-lg font-semibold">{convertedPrice}</div>
          <div className="inline line-through text-gray-400">
            {convertedOriginalPrice}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
