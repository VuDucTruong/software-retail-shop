import { useEffect } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type ActionType = "create" | "update" | "delete";
type Status = "idle" | "loading" | "success" | "error";

interface UseActionToastProps {
  status: Status;
  lastAction: ActionType | null;
  errorMessage?: string;
  reset?: () => void;
}

const messages: Record<ActionType, Record<Status, string>> = {
  create: {
    loading: "Đang tạo...",
    success: "Tạo thành công!",
    error: "Tạo thất bại!",
    idle: "",
  },
  update: {
    loading: "Đang cập nhật...",
    success: "Cập nhật thành công!",
    error: "Cập nhật thất bại!",
    idle: "",
  },
  delete: {
    loading: "Đang xóa...",
    success: "Xóa thành công!",
    error: "Xóa thất bại!",
    idle: "",
  },
};

export function useActionToast({
  status,
  lastAction,
  errorMessage,
}: UseActionToastProps) {
  useEffect(() => {
    if (!lastAction || status === "idle") return;

    const message = messages[lastAction][status];

    if (status === "loading") {
      toast.loading(message);
    } else {
      toast.dismiss();
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(`${message}${errorMessage ? ": " + errorMessage : ""}`);
      }
    }

  }, [status, lastAction]);
}
