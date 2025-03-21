'use client'

import HomeCarousel from "@/components/home/HomeCarousel";
import HomeProductSection from "@/components/home/HomeProductSection";
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex flex-col h-full gap-12">
      <div className="shadow-lg rounded-xl bg-base-300">
        <HomeCarousel />
      </div>
      <HomeProductSection title="Popular products" subtitle="You can't miss these" onMoreClick={() => {}} />
    </div>
  );
}
