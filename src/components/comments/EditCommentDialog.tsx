
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

import { Eye, Pen } from "lucide-react";
import { UserComment } from "@/api";
import UserCommentSection from "../product/UserCommentSection";
import { DialogDescription } from "@radix-ui/react-dialog";

type EditCommentDialogProps = {
  comment: UserComment;
}

export default function EditCommentDialog({comment}: EditCommentDialogProps) {

  const t = useTranslations();


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:text-yellow-500 hover:border-yellow-500">
          <Eye/>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle asChild className="text-2xl"><h2>{"Chi tiết bình luận"}</h2></DialogTitle>
          <DialogDescription>
            Chi tiết bình luận của {comment.author.fullName} trên sản phẩm {"XXXX"} vào ngày {comment.createdAt}.
          </DialogDescription>
        </DialogHeader>
        <div>
          <UserCommentSection comment={comment} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
