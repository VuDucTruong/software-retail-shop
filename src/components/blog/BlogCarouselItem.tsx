import Image from 'next/image'
import React from 'react'

export default function BlogCarouselItem() {
  return (
    <div className="relative overflow-hidden border border-border group shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
    <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
      <Image
        src="/empty_img.png"
        alt="Image"
        fill
        className="object-cover"
      />
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white @container">
      <div className="mb-1 text-xs group-hover:bg-primary group-hover:text-white font-bold uppercase bg-black/50 px-2 py-1 w-fit rounded">Game</div>
      <h2 className="@[200px]:text-lg @[100px]:text-xs font-bold leading-snug">
        VALORANT Mobile bắt đầu mở đăng ký tại Trung Quốc sau 4 năm phát triển
      </h2>
      <p className="mt-1 text-sm text-gray-300">
        <span className="font-semibold text-white">Sang Ri</span> - 23/04/2025
      </p>
    </div>
  </div>
  )
}
