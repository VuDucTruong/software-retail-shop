// components/FeaturedPostCard.tsx
import Image from 'next/image';
import {Link} from "@/i18n/navigation";

interface FeaturedPostProps {
  id: number,
  title: string;
  image: string;
  category: string;
  author: string;
  date: string;
  description: string;
}

export default function FeaturedPostCard({
                                           id,
                                           title,
                                           image,
                                           category,
                                           author,
                                           date,
                                           description,
                                         }: FeaturedPostProps) {
  return (
    <Link href={`/blog/${id}`}>
      <div className="w-full group cursor-pointer">
        <div className="relative w-full h-50 mb-4 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm">
          {category}
        </span>
        </div>
        <h2 className=" font-bold text-xl mb-2 group-hover:text-primary hover:underline cursor-pointer">{title}</h2>
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">{author}</span> - {date}
        </div>
        <p className="text-gray-700 mb-2">{description}</p>
      </div>
    </Link>
  );
}
