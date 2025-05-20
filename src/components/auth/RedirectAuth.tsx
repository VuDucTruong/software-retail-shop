"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function RedirectAuth() {

  const router = useRouter();

  const [getMe, isAuthenticated] = useAuthStore(useShallow((state) => [
    state.getMe,
    state.isAuthenticated,
  ]));
  useEffect(() => {
    getMe(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }else {
      router.push("/admin/login");
    }
  }, [isAuthenticated]);

  return null;
}
