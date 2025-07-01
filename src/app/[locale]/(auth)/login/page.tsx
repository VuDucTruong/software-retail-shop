"use client";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthToast } from "@/hooks/use-auth-toast";
import { useAuthStore } from "@/stores/auth.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function LoginPage() {
  const t = useTranslations();

  const [login, status, lastAction, error] = useAuthStore(
    useShallow((state) => [
      state.login,
      state.status,
      state.lastAction,
      state.error,
    ])
  );

  const router = useRouter();


  useAuthToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  useEffect(() => {
    if (status === "success" && lastAction === "login") {
      router.push("/");
    }
  }, [status, lastAction , router]);

  return (
    <div className="flex flex-row gap-16 min-h-screen justify-center  p-8">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image
            alt="Logo"
            src="/logo.png"
            width={100}
            height={100}
            className="rounded-full mr-2"
          />
          </Link>

          <h1 className="text-3xl font-bold ml-2">{t("Login")}</h1>
        </div>

        <p className="italic text-muted-foreground mb-6">
          {t("login_description")}
        </p>

        <LoginForm onSubmit={login} />

    

        <div className="flex items-center justify-center mt-4 text-muted-foreground gap-1">
          <p>{t("no_account_question")}</p>          
          <Link href="/register" className="text-primary hover:underline">
            {t("Register")}
          </Link>
        </div>
      </div>

      <div className="relative w-1/2 rounded-lg border border-border shadow-md">
        <Image
          alt="Login"
          className="rounded-xl"
          src="/login.jpg"
          fill
          sizes="100%"
        />
      </div>
    </div>
  );
}
