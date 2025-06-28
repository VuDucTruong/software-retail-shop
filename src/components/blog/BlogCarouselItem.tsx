import Image from 'next/image'
import React from 'react'
import {BlogDomainType} from "@/api";
import {getDateLocal} from "@/lib/date_helper";
import {Link} from "@/i18n/navigation";
import {GenreDomain} from "@/stores/blog/genre.store";
import {useShallow} from "zustand/shallow";
import {BLOG_Q_PARAMS} from "@/lib/constants";

type CarouselItemPropType = {
  blog: BlogDomainType,
  maxG2Display?: number
}

export default function BlogCarouselItem({blog, maxG2Display = 4}: CarouselItemPropType) {
  const genre2s = GenreDomain.useStore(useShallow(s => s.genre2s))
  return (
    <div
      className="relative overflow-hidden border border-border rounded-lg group shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
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
        <div className={'flex gap-x-2  flex-wrap'}>
          {genre2s.slice(0, maxG2Display).map(g2 =>
            <Link key={g2.id}
                  href={`/blog/search?${BLOG_Q_PARAMS.search}=&${BLOG_Q_PARAMS.page}=0${BLOG_Q_PARAMS.genres}=${g2.id}`}>
              <div
                className="text-xs hover:bg-primary group-hover:text-white font-bold uppercase bg-black/50 px-2 py-1 w-fit rounded">
                {g2.name}
              </div>
            </Link>
          )}
        </div>
        <Link href={`/blog/${blog.id}`}>
          <h2 className="@[200px]:text-lg @[100px]:text-xs font-bold leading-snug hover:underline hover:text-blue-300">{blog.title}</h2>
        </Link>
        <p className="mt-1 text-sm text-gray-300">
          <span className="font-semibold text-white">{blog?.author?.fullName || "Sang Ri"}</span> - {blog?.publishedAt || getDateLocal()}
        </p>
      </div>
    </div>
  )
}
