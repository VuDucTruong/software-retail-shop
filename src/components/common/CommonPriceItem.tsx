import {
  calcDiscountPercentage,
  convertPriceToVND,
} from "@/lib/currency_helper";
import DiscountItem from "./DiscountItem";

type Props = {
  price: number;
  originalPrice: number;
};

export default function CommonPriceItem({ price, originalPrice }: Props) {
  const discountPercentage = calcDiscountPercentage(price, originalPrice);
  return (
    <div className="flex justify-between items-center gap-1">
      <h4>{convertPriceToVND(price)}</h4>
      {discountPercentage > 0 && (
        <div className="flex gap-2 items-center">
          <div className="font-medium text-muted-foreground line-through">
            {convertPriceToVND(originalPrice)}
          </div>
          <DiscountItem discountPercentage={discountPercentage} />
        </div>
      )}
    </div>
  );
}
