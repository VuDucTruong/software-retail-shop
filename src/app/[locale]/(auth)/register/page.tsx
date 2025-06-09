"use client";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

export default function RegisterPage() {
  const router = useRouter();
  const handleBackToLogin = () => {
    router.push("/login");
  };

  const t = useTranslations();


  return (
    <div className="flex flex-row min-h-screen p-8 justify-around">
      <div className="flex flex-col justify-center">
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

        <div className="flex items-center">
          <Image
            alt="Logo"
            src="/logo.png"
            width={100}
            height={100}
            className="rounded-full mr-2"
          />

          <h1 className="text-3xl font-bold ml-2">{t("Register")}</h1>
        </div>
        <RegisterForm />
      </div>
      <div className="relative w-1/2 rounded-lg border border-border shadow-md">
        <Image
          alt="register poster"
          className="rounded-xl"
          src="/register.jpg"
          fill
          sizes="100%"
        />
      </div>
    </div>
  );
}
