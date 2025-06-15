import { useClientCommentStore } from "@/stores/cilent/client.comment.store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { CommentForm } from "./CommentForm";
import CommentItem from "./CommentItem";

type Props = {
  productId: number;
};

export default function UserCommentSection({ productId }: Props) {
  const [comments, getCommentsByProductId , status , lastAction , error, createComment] = useClientCommentStore(
    useShallow((state) => [state.comments, state.getCommentsByProductId , state.status , state.lastAction , state.error, state.createComment])
  );
  const t = useTranslations();

  useEffect(() => {
    getCommentsByProductId(productId);
  }, [getCommentsByProductId, productId]);

  const handleSubmitComment = (data: string) => {
    createComment({
      productId: productId,
      content: data,
    })
  };

  if(status === "error" && lastAction === "create") {
    toast.error(t('create_comment_error', { error: error || t('unknown_error') }));
  }

  return (
    <div className="flex flex-col gap-4 main-container">
      <CommentForm onSubmit={handleSubmitComment} />

      <div className="w-full bg-border h-px"></div>

      {/* Comment list */}
      {comments?.data.map((comment, index) => (
        <CommentItem key={index} comment={comment} parentId={comment.id} productId={productId} />
      ))}

      {(comments?.data.length === 0 || !comments) && (
        <div className="flex flex-col items-center justify-center w-full h-32">
          <p className="text-lg font-semibold text-gray-500">{t('no_comments_here')}</p>
          <div className="text-sm italic text-gray-400">{t('become_the_first_commenter')}</div>
        </div>
      )}
    </div>
  );
}
