import { useTranslations } from "next-intl";
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
    loading: "Action.createUser.loading",
    success: "Action.createUser.success",
    error: "Action.createUser.error",
    idle: "",
  },
  deleteUsers: {
    loading: "Action.deleteUsers.loading",
    success: "Action.deleteUsers.success",
    error: "Action.deleteUsers.error",
    idle: "",
  }
};

export function useUserToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {
  const t = useTranslations();
  useEffect(() => {
    if (!lastAction || status === "idle") return;

    const actionMess = messages[lastAction];

    if(!actionMess) return;

    const message = t(actionMess[status]);


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

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, lastAction]);
}
