// components/FeaturedPostCard.tsx
import Image from 'next/image';
import {Link} from "@/i18n/navigation";
import {GenreDomain} from "@/stores/blog/genre.store";
import {BLOG_Q_PARAMS} from "@/lib/constants";

interface FeaturedPostProps {
  id: number,
  title: string;
  image: string;
  categories: GenreDomain.Genre2Type[];
  author: string;
  date: string;
  description: string;
}

export default function FeaturedPostCard({
                                           id, title, image, categories, author, date, description,
                                         }: FeaturedPostProps) {
  return (
    <div className="w-full group cursor-pointer">
      <div className="relative w-full h-50 mb-4 overflow-hidden rounded-lg">
        <Link href={`/blog/${id}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </Link>

        <div
          className="absolute top-0 left-0 flex flex-wrap gap-4 ">
          {
            categories.map(g2 =>
              <Link key={g2.id}
                    href={`/blog/search?${BLOG_Q_PARAMS.search}=&${BLOG_Q_PARAMS.page}=0${BLOG_Q_PARAMS.genres}=${g2.id}`}>
              <span key={g2.id} className="bg-black/50  hover:bg-primary text-white text-xs px-2 py-1 rounded font-bold uppercase ">
                  {g2.name}
                </span>
              </Link>
            )
          }
        </div>

      </div>
      <Link href={`/blog/${id}`}>
        <h2 className=" font-bold text-xl mb-2 group-hover:text-primary hover:underline cursor-pointer">{title}</h2>
      </Link>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-semibold">{author}</span> - {date}
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
    </div>
  );
}
