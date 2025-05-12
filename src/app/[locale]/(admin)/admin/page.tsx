"use client";
import LoadingPage from "@/components/special/LoadingPage";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useEffect } from "react";

export default function AdminPage() {
  const getProfile = useUserStore((state) => state.getProfile);
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const lastAction = useUserStore((state) => state.lastAction);
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (lastAction === "getProfile" && status !== "loading") {
      useAuthStore.setState({
        user: user,
      });
    }
  }, [lastAction , status]);

  return LoadingPage();
}
