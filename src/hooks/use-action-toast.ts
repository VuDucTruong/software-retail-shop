import { useEffect, useRef } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type Status = "idle" | "loading" | "success" | "error";
type ActionType = "create" | "update" | "delete" | "get";
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
  get: {
    loading: "Đang tải dữ liệu...",
    success: "Tải dữ liệu thành công!",
    error: "Tải dữ liệu thất bại!",
    idle: "",
  }
};

export function useActionToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {

  const didMount = useRef(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);
  useEffect(() => {

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    console.log("action" , lastAction, "status", status, "errorMessage", errorMessage);
    if (!lastAction || status === "idle" || lastAction === "get") return;
   
    const message = messages[lastAction][status];



    if (status === "loading") {
      toastIdRef.current = toast.loading(message);
    } else {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(`${message}${errorMessage ? ": " + errorMessage : ""}`);
      }
      reset?.();
    }
    

  }, [status, lastAction]);
}
