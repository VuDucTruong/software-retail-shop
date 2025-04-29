import React from "react";

export default function DiscountItem({discountPercentage}: {discountPercentage: number}) {
  return (
    <div className=" p-1 rounded-md text-sm bg-red-600 text-white font-medium">
      -{discountPercentage}%
    </div>
  );
}
