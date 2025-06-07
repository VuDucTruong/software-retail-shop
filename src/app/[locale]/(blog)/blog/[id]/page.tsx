'use client'
import BlogGenreSection from "@/components/blog/BlogGenreSection";
import NavPostLink from "@/components/blog/NavPostLink";
import HorizontalPostListItem from "@/components/blog/HorizontalPostListItem";
import ThreeDButton from "@/components/common/ThreeDButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeftCircle } from "lucide-react";
import React from "react";
import VerticalPostListItem from "@/components/blog/VerticalPostListItem";
import { RichTextViewer } from "@/components/rich_text/RichTextViewer";

export default function DetailBlogPage() {
  return (
    <div className="flex flex-row-reverse gap-6 main-container py-10">
      <div className="w-1/4">
        <BlogGenreSection genre="Moi nhat">
          {Array.from({ length: 5 }, (_, index) => (
            <HorizontalPostListItem
              key={index}
              title="DOOM: The Dark Ages tung trailer mới – Chiến trường đẫm máu thời Trung cổ"
              image="/empty_img.png"
              date="22/04/2025"
              author="Sang Ri"
            />
          ))}
        </BlogGenreSection>
      </div>
      <div className="flex flex-col flex-1 gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <TagItem key={index} tag="Game" />
            ))}
          </div>

          <h1>
            DOOM: The Dark Ages tung trailer mới – Chiến trường đẫm máu thời
            Trung cổ
          </h1>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">Sang Ri</div>
            <div className="text-sm text-gray-500">22/04/2025</div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <RichTextViewer content="Content in here"/>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 items-start">
          <div className="flex gap-2 border-y border-border w-full py-4">
            <TagItem
              tag="Tags"
              className="hover:bg-black bg-black cursor-auto"
            />
            {Array.from({ length: 4 }, (_, index) => (
              <TagItem key={index} tag="Game" />
            ))}
          </div>

          <div className="grid grid-cols-2 w-full place-content-between gap-10">
            <NavPostLink
              id={0}
              direction="prev"
              title="The Elder Scrolls IV: Oblivion Remastered tiếp tục rò rỉ thông tin"
            />
            <NavPostLink
              id={2}
              direction="next"
              title="The Elder Scrolls IV: Oblivion Remastered tiếp tục rò rỉ thông tin"
            />
          </div>

          
          
        </CardFooter>
      </Card>

      <BlogGenreSection genre="Lien quan" >
          <div className="flex gap-2 items-center">
          {Array.from({ length:4}, (_, index) => (
            <VerticalPostListItem
              key={index}
              title="DOOM: The Dark Ages tung trailer mới – Chiến trường đẫm máu thời Trung cổ"
              image="/empty_img.png"
              category="GAME"
              author="Sang Ri"
              date="22/04/2025"
            />
          ))}
          </div>
        </BlogGenreSection>
      </div>

      
    </div>
  );
}

function TagItem({ tag, className = "" }: { tag: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-2 py-1 border border-border bg-gray-400 text-sm font-medium hover:bg-primary cursor-pointer text-white rounded-sm",
        className
      )}
    >
      {tag}
    </div>
  );
}
