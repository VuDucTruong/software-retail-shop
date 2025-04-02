import { createFormatter } from "next-intl";

export const convertPriceToVND = (
  price: number,
  format: ReturnType<typeof createFormatter>
) =>
  format.number(price, {
    style: "currency",
    currency: "VND",
  });

export const calcDiscountPercentage = (price: number, originalPrice: number) =>
  Math.round((price * 100) / originalPrice);
