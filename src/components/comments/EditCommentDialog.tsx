import { useTranslations } from "next-intl";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";

import { UserComment } from "@/api";
import { Eye } from "lucide-react";
import AdminCommentItem from "./AdminCommentItem";
import { useCommentStore } from "@/stores/comment.store";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useCommentDialogStore } from "@/stores/dialog.store";
import { useShallow } from "zustand/shallow";


export default function EditCommentDialog() {
  const t = useTranslations();
  const [open , comment] = useCommentDialogStore(useShallow((state) => [
    state.open,
    state.data,
  ]));
  const getCommentById = useCommentStore((state) => state.getCommentById);
  const selectedComment = useCommentStore((state) => state.selectedComment);
  useEffect(() => {
    if (open) {
      getCommentById(comment!.parentCommentId ?? comment!.id);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          useCommentDialogStore.getState().closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="hidden"></div>
      </DialogTrigger>
      <DialogContent
        className="w-1/2 overflow-auto"
      >
        <DialogHeader>
          <DialogTitle asChild className="text-2xl">
            <h2>{"Chi tiết bình luận"}</h2>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground italic">
            Chi tiết bình luận của{" "}
            <span className="text-black font-medium">
              "{selectedComment?.author.fullName}"
            </span>{" "}
            trên sản phẩm{" "}
            <span className="text-black font-medium">
              {selectedComment?.product?.name}
            </span>{" "}
            vào ngày {selectedComment?.createdAt}.
          </DialogDescription>
        </DialogHeader>
        <div>
          {!selectedComment ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <AdminCommentItem
              comment={selectedComment}
              parentId={selectedComment.parentCommentId ?? selectedComment.id} // if parent is null , it is the root comment
              productId={selectedComment.product?.id}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
