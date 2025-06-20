// components/FeaturedPostCard.tsx
import Image from "next/image";

interface VerticalPostListItemProps {
    title: string;
    image: string;
    subtitle?: string;
    category: string;
    date: string;
    author: string;
}

export default function VerticalPostListItem({
                                                 title,
                                                 image,
                                                 category,
                                                 subtitle,
                                                 date,
                                                 author,
                                             }: VerticalPostListItemProps) {
    return (
        <div className="w-full group cursor-pointer rounded-md border border-border shadow-md">
            <div className="relative w-full h-30 mb-4 overflow-hidden ">
                <Image src={'/empty_img.png'} alt={'empty_img.png'} fill className="object-contain"/>
                <span
                    className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm">{category} </span>
            </div>
            <div className="px-4 py-2 border-t border-border">
                <div className=" font-medium text-sm mb-2 group-hover:text-primary hover:underline cursor-pointer">
                    {title}
                </div>
                <div className="text-sm text-gray-600 mb-1 italic max-h-16 break-all !overflow-ellipsis line-clamp-3">
                    {subtitle ?? ""}
                </div>
                <div className="text-sm text-gray-600 mb-1 flex">
                    <span className="font-medium">{author}</span> - {date}
                </div>
            </div>
        </div>
    );
}
