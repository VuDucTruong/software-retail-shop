import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UserComment } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import { Role } from "@/lib/constants";
import { getRoleWeight } from "@/lib/utils";
import { useClientCommentStore } from "@/stores/cilent/client.comment.store";
import { useCommentStore } from "@/stores/comment.store";
import { spawn } from "child_process";

type Props = {
  comment: UserComment;
  productId?: number;
  parentId?: number | null;
};

export default function AdminCommentItem({
  comment,
  productId,
  parentId,
}: Props) {
  const t = useTranslations();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const createComment = useCommentStore((state) => state.createComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const handleReplySubmit = () => {
    if (!replyRef.current?.value.trim()) return;
    const replyContent = replyRef.current.value.trim();
    createComment(
      {
        productId: productId!,
        content: replyContent,
        parentCommentId: parentId!,
      },
      true
    );
    setShowReplyInput(false);
  };

  const handleDelete = (id: number) => {
    deleteComment(id, parentId ?? undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center w-full">
        <div className="flex flex-col items-start">
          <div className="font-semibold">
            {comment.author.fullName}
            {" : "}
            {comment.deletedAt ? (
              <span className="text-muted-foreground italic font-normal">
                {t("deleted_at_x", { x: comment.deletedAt })}
              </span>
            ) : (
              <span className="font-normal break-all">{comment.content}</span>
            )}
          </div>
          <div className="flex gap-6 items-center">
            <Button
              variant={"link"}
              onClick={() => setShowReplyInput(!showReplyInput)}
              className=" p-0"
            >
              {t("Respond")}
            </Button>
            <Button
              variant={"link"}
              onClick={() => handleDelete(comment.id)}
              className=" text-red-500 p-0"
              disabled={comment.deletedAt !== null}
            >
              {t("Delete")}
            </Button>
            <div className="text-muted-foreground">{comment.createdAt}</div>
          </div>
        </div>
      </div>

      {/* Input phản hồi */}
      {showReplyInput && (
        <div className={`mt-2 flex flex-col gap-2 ${comment.parentCommentId ? "" : "ml-24"}`}>
          <Textarea
            className="textarea rounded-md focus:outline-none w-full"
            placeholder={t("Input.write_reply_placeholder")}
            ref={replyRef}
          />
          <div className="flex gap-2">
            <Button onClick={handleReplySubmit}>{t("Send")}</Button>
            <Button
              variant={"ghost"}
              className="hover:text-red-500"
              onClick={() => setShowReplyInput(false)}
            >
              {t("Cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Hiển thị danh sách phản hồi */}
      <div className="ml-12 border-l-2 pl-4 border-border">
        {(comment.replies ?? []).map((reply: UserComment, index: number) => (
          <AdminCommentItem
            key={index}
            comment={reply}
            parentId={comment.id}
            productId={productId}
          />
        ))}
      </div>
    </div>
  );
}
