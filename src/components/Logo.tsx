import { shopName } from "@/config/constants";
import React from "react";
import Image from "next/image";
export default function Logo() {
  return (
    <div className="flex flex-row justify-start items-center not-lg:hidden ">
      <div className="relative size-[70px]">
        <Image alt={shopName} src="/logo.png" fill className="object-cover" />
      </div>
      <h3 className="text-primary">{shopName}</h3>
    </div>
  );
}
