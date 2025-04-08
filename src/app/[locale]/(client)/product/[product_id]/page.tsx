"use client";
import React, { useRef, useState } from "react";

import { IoMdSend } from "react-icons/io";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { CommentItemProps } from "@/types/comment_item";
import { sampleComments, sampleParagraph } from "@/config/sampleData";
import ProductInfo from "@/components/product/ProductInfo";
import { CommentForm } from "@/components/product/CommentForm";
import UserCommentSection from "@/components/product/UserCommentSection";
import HomeProductSection from "@/components/home/HomeProductSection";
import { Separator } from "@radix-ui/react-select";
import RelatedProductSection from "@/components/product/RelatedProductSection";
export default function DetailProductPage() {
  const t = useTranslations();
  const [comments, setComments] = useState(sampleComments);
  const handleSubmitComment = (data: string) => {
    const newComment: CommentItemProps = {
      id: uuidv4(),
      avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      content: data,
      timestamp: "Vừa xong",
      replies: [],
      isOwner: true,
      username: "Bạn",
    };
    setComments([...comments, newComment]);
    console.log("Comment submitted:", data);
    console.log("All comments:", comments);
  };

  // Xử lý thêm phản hồi
  const handleReply = (index: number, reply: CommentItemProps) => {
    console.log("Reply", index, reply);
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments[index].replies?.push(reply);
      return updatedComments;
    });
  };

  // Xử lý xóa bình luận
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      setComments((prev) =>
        prev
          .map((comment) => ({
            ...comment,
            replies: comment.replies?.filter((reply) => reply.id !== id),
          }))
          .filter((comment) => comment.id !== id)
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product General Info */}
      <ProductInfo />

      {/* Warning */}
      <div className="bg-border/20 rounded-md shadow-sm w-fit min-w-1/4 main-container">
        <p className="text-red-500 font-semibold text-lg">{t("Note")}</p>
        <ul className="list-disc list-inside">
          <li>Khong ho tro tra lai</li>
          <li>Khong ho tro doi san pham</li>
          <li>Khong ho tro hoan tien</li>
        </ul>
      </div>

      {/* Description */}
      <div className="grid grid-cols-3 gap-4 main-container">
        <h3>{t("product_detail")}</h3>
        <div className="col-span-2 whitespace-pre-line">{sampleParagraph}</div>
      </div>
      {/* Rating */}
      <div className="flex flex-row justify-end font-semibold border-b border-neutral-300 pb-4 main-container">
        {t("Rating")}: 4.5 ⭐ (1000 {t("Votes")})
      </div>

      {/* Comment List */}

      <div className="main-container">
      <RelatedProductSection title={t("related_products")} />
      </div>

      {/* Comments */}

      <div className="flex flex-col gap-4 main-container">
        <CommentForm onSubmit={(comment) => handleSubmitComment(comment)} />

        <div className="w-full bg-border h-px"></div>

        {/* Comment list */}
        {comments.map((comment, index) => (
          <UserCommentSection
            key={index}
            {...comment}
            onReply={(reply) => handleReply(index, reply)}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </div>
    </div>
  );
}
