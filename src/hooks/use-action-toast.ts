import { useTranslations } from "next-intl";
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
    loading: "Action.create.loading",
    success: "Action.create.success",
    error: "Action.create.error",
    idle: "",
  },
  update: {
    loading: "Action.update.loading",
    success: "Action.update.success",
    error: "Action.update.error",
    idle: "",
  },
  delete: {
    loading: "Action.delete.loading",
    success: "Action.delete.success",
    error: "Action.delete.error",
    idle: "",
  },
  get: {
    loading: "Action.get.loading",
    success: "Action.get.success",
    error: "Action.get.error",
    idle: "",
  }
};

export function useActionToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {
  const t = useTranslations();
  const didMount = useRef(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);
  useEffect(() => {

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    console.log("action" , lastAction, "status", status, "errorMessage", errorMessage);
    if (!lastAction || status === "idle" || lastAction === "get") return;
   
    const message = t(messages[lastAction][status]) || "";



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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, lastAction]);
}
