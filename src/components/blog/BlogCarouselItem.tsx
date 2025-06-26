import Image from 'next/image'
import React from 'react'
import {BlogDomainType} from "@/api";
import {getDateLocal} from "@/lib/date_helper";
import {Link} from "@/i18n/navigation";

type CarouselItemPropType = {
  blog: BlogDomainType
}

export default function BlogCarouselItem({blog}: CarouselItemPropType) {
  return (
    <div className="relative overflow-hidden border border-border group shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
      <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
        <Link href={`/blog/${blog.id}`}>
          <Image
            src={blog?.imageUrl || "/empty_img.png"}
            alt="Image"
            fill
            className="object-cover"
          />
        </Link>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white @container">
        <div
          className="mb-1 text-xs group-hover:bg-primary group-hover:text-white font-bold uppercase bg-black/50 px-2 py-1 w-fit rounded">Game
        </div>
        <h2 className="@[200px]:text-lg @[100px]:text-xs font-bold leading-snug">
          {blog?.title || "VALORANT Mobile bắt đầu mở đăng ký tại Trung Quốc sau 4 năm phát triển"}
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          <span
            className="font-semibold text-white">{blog?.author?.fullName || "Sang Ri"}</span> - {blog?.publishedAt || getDateLocal()}
        </p>
      </div>
    </div>
  )
}
