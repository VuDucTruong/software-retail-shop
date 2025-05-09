
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UserComment, Reply } from "@/api";


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

  const handleReplySubmit = () => {
    if (!replyRef.current?.value.trim()) return;
    const replyContent = replyRef.current.value.trim();
    
    setShowReplyInput(false);
  };

  const handleDelete = (id: number) => {

  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center w-full">
        <div className="relative ring-primary size-24 rounded-full ring ring-offset-2">
          <Image
            alt="Avatar"
            fill
            className="rounded-full object-cover"
            src={""}
          />
        </div>
        <div className="flex flex-col items-start">
          <h4 className="font-semibold">{"FAFAF"}</h4>
          <div className="text-muted-foreground">
            {t("comment_on_date")} {"2023-10-01"}
          </div>
          <p>{"GSF"}</p>
          {/* Hành động */}
          <div className="flex gap-6">
            <Button
              variant={"link"}
              onClick={() => setShowReplyInput(!showReplyInput)}
              className=" p-0"
            >
              {t("Respond")}
            </Button>
            {false && (
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
