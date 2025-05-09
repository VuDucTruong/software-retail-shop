"use client";

import { checkAuthorization } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectAuth() {
  const router = useRouter();
  
  useEffect(() => {
    checkAuthorization(router);
  }, []);

  return null;
}
