import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { useCommentStore } from "@/stores/comment.store";
import { useCommentDialogStore } from "@/stores/dialog.store";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";
import AdminCommentItem from "./AdminCommentItem";

export default function EditCommentDialog() {
  const t = useTranslations();
  const [open, comment] = useCommentDialogStore(
    useShallow((state) => [state.open, state.data])
  );
  const getCommentById = useCommentStore((state) => state.getCommentById);
  const selectedComment = useCommentStore((state) => state.selectedComment);
  useEffect(() => {
    if (open && comment) {
      getCommentById(comment!.parentCommentId ?? comment!.id);
    }
  }, [open, getCommentById, comment]);

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
      <DialogContent className="w-1/2 overflow-auto">
        <DialogHeader>
          <DialogTitle asChild className="text-2xl">
            <h2>{t("comment_detail")}</h2>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground italic">
            {t("comment_detail_of")}{" "}
            <span className="text-black font-medium">
              {`"${selectedComment?.author.fullName}"`}
            </span>{" "}
            {t("on_product")}{" "}
            <span className="text-black font-medium">
              {`"${selectedComment?.product?.name}"`}
            </span>{" "}
            {t("on_date")} {selectedComment?.createdAt}.
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
