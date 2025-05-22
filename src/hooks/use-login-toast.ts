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
  login: {
    loading: "Đang đăng nhập...",
    success: "Đăng nhập thành công!",
    error: "Đăng nhập thất bại!",
    idle: "",
  },
  register: {
    loading: "Đang đăng ký...",
    success: "Đăng ký thành công!",
    error: "Đăng ký thất bại!",
    idle: "",
  },
  logout: {
    loading: "Đang đăng xuất...",
    success: "Đăng xuất thành công!",
    error: "Đăng xuất thất bại!",
    idle: "",
  },
  changePassword: {
    loading: "Đang thay đổi mật khẩu...",
    success: "Thay đổi mật khẩu thành công!",
    error: "Thay đổi mật khẩu thất bại!",
    idle: "",
  },
};

export function useLoginToast({
  status,
  lastAction,
  errorMessage,
}: UseActionToastProps) {
  useEffect(() => {


    if (
      !lastAction ||
      status === "idle" ||
      lastAction === "logout" ||
      lastAction === "changePassword"
    )
      return;

    
    const actionMessages = messages[lastAction];
    if (!actionMessages) return;

    const message = actionMessages[status];
   
    
    
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
