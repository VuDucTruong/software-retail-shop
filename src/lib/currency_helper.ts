

export const convertPriceToVND = (
  price: number,
) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const calcDiscountPercentage = (price: number, originalPrice: number) => {
  if(price === originalPrice) return 0;
  if(originalPrice === 0) return 0;
  return Math.round(((originalPrice - price) * 100) / originalPrice);
}