import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner"; // hoặc react-hot-toast, tùy bạn

type Status = "idle" | "loading" | "success" | "error";
type ActionType = "createTicket";
interface UseActionToastProps {
    status: Status;
    lastAction: ActionType | null;
    errorMessage?: string;
    reset?: () => void;
}

const messages: Record<ActionType, Record<Status, string>> = {
  createTicket: {
    loading: "Action.createTicket.loading",
    success: "Action.createTicket.success",
    error: "Action.createTicket.error",
    idle: "",
  }
};

export function useTicketToast({
  status,
  lastAction,
  errorMessage,
  reset
}: UseActionToastProps) {
  const t = useTranslations();
  const didMount = useRef(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);
  
  useEffect(() => {
    console.log("mounted" , didMount.current)
    if (!didMount.current) {
      didMount.current = true;
      return;
    }


    if (!lastAction || status === "idle") return;
   
    const message = t(messages[lastAction][status]) || "";

    if (!message) return;

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
