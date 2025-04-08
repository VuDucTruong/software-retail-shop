

export const convertPriceToVND = (
  price: number,
) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const calcDiscountPercentage = (price: number, originalPrice: number) =>
  Math.round((price * 100) / originalPrice);
