"use client";

import { useAuthStore } from "@/stores/auth.store";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function RedirectAuth() {
  const router = useRouter();
  const pathName = usePathname();
  const getMe = useAuthStore((state) => state.getMe);

  useEffect(() => {
    getMe(true);

    const unsubscribe = useAuthStore.subscribe((state) => {
      const isOnAdminRoot = pathName.split("/").at(-1) === "admin";

      if (state.isAuthenticated && isOnAdminRoot) {
        console.log("Redirecting to dashboard page");
        router.push("/admin/dashboard");
      }

      if (!state.isAuthenticated) {
        console.log("Redirecting to login page");
        router.push("/admin/login");
      }
    });

    return () => {
      unsubscribe(); // ✅ clean up
    };
  }, [getMe, pathName]);

  return null;
}