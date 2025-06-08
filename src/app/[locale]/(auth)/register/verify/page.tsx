"use client";
import VerificationForm from "@/components/auth/VerificationForm";
import { Button } from "@/components/ui/button";
import { useAuthToast } from "@/hooks/use-auth-toast";
import { useAuthStore } from "@/stores/auth.store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useShallow } from "zustand/shallow";

export default function VerificationPage() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || null;

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const [verifyEmail, lastAction, status, error, sendOTP] = useAuthStore(
    useShallow((state) => [
      state.verifyEmail,
      state.lastAction,
      state.status,
      state.error,
      state.sendOTP,
    ])
  );

  useAuthToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });



  useEffect(() => {
    if (status === "success" && lastAction === "verifyEmail") {
      router.push("/login");
    }
  }, [status, lastAction, router]);


    if (!email) {
    return notFound();
  }

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="flex items-center justify-start">
        <Button
          className="flex items-center"
          variant={"ghost"}
          onClick={handleBackToLogin}
        >
          <BiArrowBack />
          {t("back_to_login")}
        </Button>
      </div>

      <div className="w-[400px] h-[400px] overflow-hidden">
        <Image
          src="/otp.avif"
          alt="OTP Poster"
          width={400}
          height={400}
          className="object-cover scale-135 origin-center"
        />
      </div>

      <VerificationForm
        email={email}
        onSendOTP={() => sendOTP(email)}
        onVerify={(otp) => verifyEmail(email, otp)}
      />
    </div>
  );
}
