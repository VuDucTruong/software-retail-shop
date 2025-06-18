"use client";

import * as React from "react";
import "@/styles/brand_animation.css";
import Image from "next/image";

const brands = [
  {
    name: "Steam",
    img: "/brands/Steam.png",
  },
  {
    name: "Canva",
    img: "/brands/Canva.png",
  },
  {
    name: "Gemini",
    img: "/brands/Gemini.png",
  },
  {
    name: "Microsoft",
    img: "/brands/Microsoft.png",
  },
  {
    name: "OpenAI",
    img: "/brands/OpenAI.png",
  },
  {
    name: "Zoom",
    img: "/brands/Zoom.png",
  },
  {
    name: "Capcut",
    img: "/brands/Capcut.png",
  }
];

export default function BrandCarousel() {
  return (
    <div className="w-full overflow-hidden py-4">
      <div className="relative flex w-[200%] animate-marquee">
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="w-[20%] gap-6 flex justify-center">
            <Image
              src={brand.img}
              alt={brand.name}
              width={96} // equivalent to w-24 (24 * 4 = 96px)
              height={0} // height will auto-adjust due to object-contain
              className="object-contain w-24 h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
