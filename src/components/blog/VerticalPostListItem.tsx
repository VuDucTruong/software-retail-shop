// components/FeaturedPostCard.tsx
import Image from 'next/image';

interface VerticalPostListItemProps {
  title: string;
  image: string;
  category: string;
}

export default function VerticalPostListItem({
  title,
  image,
  category,
}: VerticalPostListItemProps) {
  return (
    <div className="w-full group cursor-pointer">
      <div className="relative w-full h-30 mb-4 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
        />
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm">
          {category}
        </span>
      </div>
      <div className=" font-medium text-sm mb-2 group-hover:text-primary hover:underline cursor-pointer">{title}</div>
    </div>
  );
}
