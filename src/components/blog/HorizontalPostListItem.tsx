// components/PostListItem.tsx
import Image from "next/image";
import Link from "next/link";

interface PostListItemProps {
  id: number,
  title: string;
  image: string;
  date: string;
  author: string;
}

export default function HorizontalPostListItem({
                                                 id,
  title,
  image,
  date,
  author,
}: PostListItemProps) {
  return (
    <Link href={`/blog/${id}`}>
      <div className="flex items-start gap-4 mb-4 cursor-pointer group">
        <div className="relative w-20 h-16 rounded overflow-hidden shrink-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-medium text-sm leading-tight hover:underline group-hover:text-primary cursor-pointer">
            {title}
          </h3>
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{author}</span> - {date}
          </div>
        </div>
      </div>
    </Link>
  );
}
