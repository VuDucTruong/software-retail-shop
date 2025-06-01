import { useClientCommentStore } from "@/stores/cilent/client.comment.store";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { CommentForm } from "./CommentForm";
import CommentItem from "./CommentItem";
import { toast } from "sonner";

type Props = {
  productId: number;
};

export default function UserCommentSection({ productId }: Props) {
  const [comments, getCommentsByProductId , status , lastAction , error, createComment] = useClientCommentStore(
    useShallow((state) => [state.comments, state.getCommentsByProductId , state.status , state.lastAction , state.error, state.createComment])
  );


  useEffect(() => {
    getCommentsByProductId(productId);
  }, []);

  const handleSubmitComment = (data: string) => {
    createComment({
      productId: productId,
      content: data,
    })
  };

  if(status === "error" && lastAction === "create") {
    toast.error("Có lỗi xảy ra trong quá trình tạo bình luận: " + error);
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
          <p className="text-lg font-semibold text-gray-500">Chưa có bình luận nào cả...</p>
          <div className="text-sm italic text-gray-400">Hãy trở thành người đầu tiên!</div>
        </div>
      )}
    </div>
  );
}
