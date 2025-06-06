import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type Status = "idle" | "loading" | "success" | "error";
type ActionType ="like" | "unlike";
interface UseActionToastProps {
    status: Status;
    lastAction: ActionType | null;
    errorMessage?: string;
    reset?: () => void;
}

const messages: Record<ActionType, Record<Status, string>> = {
    like: {
        loading: "",
        success: "Action.likeProduct.success",
        error: "Action.likeProduct.error",
        idle: "",
    },
    unlike: {
        loading: "",
        success: "Action.unlikeProduct.success",
        error: "Action.unlikeProduct.error",
        idle: "",
    }
};

export function useFavouriteToast({
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

    if (!lastAction || status === "idle") return;

    const message = t(messages[lastAction][status]) || "";

    if (!message || message.length === 0) return;

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
