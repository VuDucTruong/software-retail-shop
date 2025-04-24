// components/PostListItem.tsx
import Image from 'next/image';

interface PostListItemProps {
  title: string;
  image: string;
  date: string;
}

export default function HorizontalPostListItem({ title, image, date }: PostListItemProps) {
  return (
    <div className="flex items-start gap-4 mb-4 cursor-pointer group">
      <div className="relative w-20 h-16 rounded overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between">
        <h3 className="font-medium text-sm leading-tight hover:underline group-hover:text-primary cursor-pointer">{title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </div>
  );
}
