"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function PermissionVerification() {
  const router = useRouter();
  const pathName = usePathname();
  const [getMe, isAuthenticated,status] = useAuthStore(
    useShallow((state) => [state.getMe, state.isAuthenticated,state.status])
  );

  useEffect(() => {
    getMe(true);
  }, [getMe]);

  useEffect(() => {
    if(status === "loading" || status === "idle") {
        return;
    }
    if (!isAuthenticated) {
      if (pathName !== "/admin/login") {
        router.push("/admin/login");
      }
    } else if (pathName === "/admin/login" || pathName === "/admin") {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, pathName, router,status]);

  return null;
}
