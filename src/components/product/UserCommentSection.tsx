
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UserComment, Reply } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import { Role } from "@/lib/constants";
import { getRoleWeight } from "@/lib/utils";


type Props = {
  comment: UserComment | Reply;
}

function isUserComment(comment: UserComment | Reply): comment is UserComment {
  return (comment as UserComment).replies !== undefined;
}

export default function UserCommentSection({ comment }: Props) {
  const t = useTranslations();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((state) => state.user);
  const enableDelete = user?.id === comment.author.id || getRoleWeight(user?.role ?? "") >= Role.STAFF.weight;
  const handleReplySubmit = () => {
    if (!replyRef.current?.value.trim()) return;
    const replyContent = replyRef.current.value.trim();
    
    setShowReplyInput(false);
  };

  useEffect(() => {} , []);

  const handleDelete = (id: number) => {

  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center w-full">
        <div className="relative ring-primary size-20 rounded-full ring ring-offset-2">
          <Image
            alt="Avatar"
            fill
            className="rounded-full object-cover"
            src={comment.author.imageUrl || "/empty_user.png"}
          />
        </div>
        <div className="flex flex-col items-start">
          <div className="font-semibold">{comment.author.fullName} <span className="italic font-normal text-sm">{(new Date(comment.createdAt)).toLocaleDateString()}</span></div>
          <p>{comment.content}</p>
          {/* Actions */}
          <div className="flex gap-6">
            <Button
              variant={"link"}
              onClick={() => setShowReplyInput(!showReplyInput)}
              className=" p-0"
            >
              {t("Respond")}
            </Button>
            {enableDelete && (
              <Button
                variant={"link"}
                onClick={() => handleDelete(comment.id)}
                className=" text-red-500 p-0"
              >
                {t("Delete")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Input phản hồi */}
      {showReplyInput && (
        <div className="ml-24 mt-2 flex flex-col gap-2">
          <Textarea
            className="textarea rounded-md focus:outline-none w-full"
            placeholder={t("Input.write_reply_placeholder")}
            ref={replyRef}
          />
          <div className="flex gap-2">
            <Button onClick={handleReplySubmit}>{t("Send")}</Button>
            <Button variant={"ghost"} className="hover:text-red-500" onClick={() => setShowReplyInput(false)}>
              {t("Cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Hiển thị danh sách phản hồi */}
      {(isUserComment(comment)) && comment.replies.length > 0 && (
        <div className="ml-12 border-l-2 pl-4 border-border">
          {comment.replies.map((reply, index) => (
            <UserCommentSection
              key={index}
              comment={reply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
