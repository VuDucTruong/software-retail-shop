import { useEffect } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type Status = "idle" | "loading" | "success" | "error";

interface UseActionToastProps {
  status: Status;
  lastAction: string | null;
  errorMessage?: string;
  reset?: () => void;
}

const messages: Record<string, Record<Status, string>> = {
  createUser: {
    loading: "Đang tạo người dùng...",
    success: "Người dùng đã được tạo thành công!",
    error: "Tạo người dùng thất bại",
    idle: "",
  },
  deleteUsers: {
    loading: "Đang cấm người dùng...",
    success: "Người dùng đã bị cấm thành công!",
    error: "Cấm người dùng thất bại",
    idle: "",
  }
};

export function useUserToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {
  useEffect(() => {
    if (!lastAction || status === "idle") return;

    const actionMess = messages[lastAction];

    if(!actionMess) return;

    const message = actionMess[status];


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
