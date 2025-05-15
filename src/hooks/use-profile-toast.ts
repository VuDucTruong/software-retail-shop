import { useEffect } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type ActionType = "getUser" | "updateProfile";
type Status = "idle" | "loading" | "success" | "error";

interface UseActionToastProps {
  status: Status;
  lastAction: ActionType | null;
  errorMessage?: string;
  reset?: () => void;
}

const messages: Record<ActionType, Record<Status, string>> = {
  getUser: {
    loading: "Đang tải thông tin cá nhân...",
    success: "Tải thông tin cá nhân thành công!",
    error: "Tải thông tin cá nhân thất bại!",
    idle: "",
  },
    updateProfile: {
        loading: "Đang cập nhật thông tin cá nhân...",
        success: "Cập nhật thông tin cá nhân thành công!",
        error: "Cập nhật thông tin cá nhân thất bại!",
        idle: "",
    },
};

export function useProfileToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {
  useEffect(() => {
    if (!lastAction || status === "idle") return;

    const message = messages[lastAction][status];
    let toastId: string | number | undefined;
    if (status === "loading") {
      toastId = toast.loading(message);
    } else {
      toast.dismiss(toastId);
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(`${message}${errorMessage ? ": " + errorMessage : ""}`);
      }
      reset?.();
    }

    

  }, [status, lastAction]);
}
