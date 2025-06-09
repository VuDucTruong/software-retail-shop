import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
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
    loading: "Action.login.loading",
    success: "Action.login.success",
    error: "Action.login.error",
    idle: "",
  },
  register: {
    loading: "Action.register.loading",
    success: "Action.register.success",
    error: "Action.register.error",
    idle: "",
  },
  logout: {
    loading: "Action.logout.loading",
    success: "Action.logout.success",
    error: "Action.logout.error",
    idle: "",
  },
  changePassword: {
    loading: "Action.changePassword.loading",
    success: "Action.changePassword.success",
    error: "Action.changePassword.error",
    idle: "",
  },
  verifyEmail: {
    loading: "Action.verifyEmail.loading",
    success: "Action.verifyEmail.success",
    error: "Action.verifyEmail.error",
    idle: "",
  },
  updateProfile: {
    loading: "Action.updateProfile.loading",
    success: "Action.updateProfile.success",
    error: "Action.updateProfile.error",
    idle: "",
  },
};

export function useAuthToast({
  status,
  lastAction,
  errorMessage,
}: UseActionToastProps) {
  const t = useTranslations();
   const didMount = useRef(false);
    const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {

    
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    console.log("useLoginToast", {
      status,
      lastAction,
      errorMessage,
    });
    if (
      !lastAction ||
      status === "idle" ||
      lastAction === "logout"
    )
      return;

    
    const actionMessages = messages[lastAction];
    if (!actionMessages) return;

    const message = t(actionMessages[status]) || "";
   
    if(!message) return;
    
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, lastAction]);
}
