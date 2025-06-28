// components/PostListItem.tsx
import Image from "next/image";
import Link from "next/link";
import {GenreDomain} from "@/stores/blog/genre.store";
import {BLOG_Q_PARAMS} from "@/lib/constants";

interface PostListItemProps {
  id: number,
  title: string;
  categories: GenreDomain.Genre2Type[];
  image: string;
  date: string;
  author: string;
}

export default function HorizontalPostListItem({
                                                 id,
                                                 categories,
                                                 title,
                                                 image,
                                                 date,
                                                 author,
                                               }: PostListItemProps) {
  return (
    <div className="flex items-start gap-4 mb-4 cursor-pointer group">
      <Link href={`/blog/${id}`}>
        <div className="relative w-20 h-16 rounded overflow-hidden shrink-0">
          <Image src={image} alt={title} fill className="object-cover"/>
        </div>
      </Link>

      <div className="flex flex-col justify-between">
        <Link href={`/blog/${id}`}>
          <h3 className="font-medium text-sm leading-tight hover:underline group-hover:text-primary cursor-pointer">
            {title}
          </h3>
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{author}</span> - {date}
          </div>
        </Link>

        <div
          className="flex flex-wrap gap-x-2 gap-y-1 ">
          {
            categories.map(g2 =>
              <Link key={g2.id}
                    href={`/blog/search?${BLOG_Q_PARAMS.search}=&${BLOG_Q_PARAMS.page}=0&${BLOG_Q_PARAMS.genres}=${g2.id}`}>
              <span key={g2.id}
                    className="bg-black/50  hover:bg-primary text-white text-xs px-2 py-1 rounded font-bold uppercase ">
                  {g2.name}
              </span>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}
