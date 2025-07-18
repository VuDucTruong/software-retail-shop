import React from "react";

export default function DiscountItem({discountPercentage}: {discountPercentage: number}) {
  return (
      <div className=" p-1 rounded-md text-base bg-red-600 text-white font-medium select-none">
        -{discountPercentage}%
      </div>
  );
}
