'use client'
import { shopName } from "@/lib/constants";
import React from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
export default function Logo() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-row justify-start items-center not-lg:hidden cursor-pointer" onClick={handleClick}>
      <div className="relative size-[70px]">
        <Image alt={shopName} src="/logo.png" fill className="object-cover" />
      </div>
      <h3 className="text-primary">{shopName}</h3>
    </div>
  );
}
