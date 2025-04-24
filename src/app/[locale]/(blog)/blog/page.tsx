"use client";

import BlogCarouselItem from "@/components/blog/BlogCarouselItem";
import BlogGenreSection from "@/components/blog/BlogGenreSection";
import FeaturedPostCard from "@/components/blog/FeaturedPostCard";
import HorizontalPostListItem from "@/components/blog/HorizontalPostListItem";

export default function BlogPage() {
  return (
    <div className="main-container flex flex-col py-10">
      <div className="grid grid-cols-3 gap-2 h-[400px] w-full">
        <div className="grid row-span-2">
          <BlogCarouselItem />
        </div>
        <div className="grid row-span-2">
          <BlogCarouselItem />
        </div>

        <BlogCarouselItem />

        <div className="grid grid-cols-2 gap-2">
          <BlogCarouselItem />
          <BlogCarouselItem />
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4">

        <div className="w-1/4">
        <BlogGenreSection genre="Moi nhat">
          {
            Array.from({ length: 5 }, (_, index) => (
              <HorizontalPostListItem
                key={index}
                title="DOOM: The Dark Ages tung trailer mới – Chiến trường đẫm máu thời Trung cổ"
                image="/empty_img.png"
                date="22/04/2025"
                author="Sang Ri"
              />
            ))
          }
        </BlogGenreSection>
        </div>

        <div className="flex flex-col flex-1">
          <BlogGenreSection genre="Meo hay">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="md:col-span-1">
                <FeaturedPostCard
                  title="VALORANT Mobile bắt đầu mở đăng ký tại Trung Quốc sau 4 năm phát triển"
                  image="/empty_img.png"
                  category="GAME"
                  author="Sang Ri"
                  date="23/04/2025"
                  description="Sau nhiều năm chờ đợi, phiên bản di động của tựa game bắn súng chiến thuật đình đám – VALORANT Mobile – cuối cùng..."
                />
              </div>
              <div className="flex flex-col justify-between">
                {Array.from({ length: 4 }, (_, index) => (
                  <HorizontalPostListItem
                    key={index}
                    title="DOOM: The Dark Ages tung trailer mới – Chiến trường đẫm máu thời Trung cổ"
                    image="/empty_img.png"
                    date="22/04/2025"
                    author="Sang Ri"
                  />
                ))}
              </div>
            </div>
          </BlogGenreSection>
        </div>
      </div>
    </div>
  );
}
