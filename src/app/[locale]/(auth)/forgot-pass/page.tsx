"use client";
import { ForgotPassowrdForm } from "@/components/auth/ForgotPassowrdForm";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations();


  return (

     <div
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/forgot-pass.jpg')" }}
    >
      <div className="w-1/3">
         <ForgotPassowrdForm />
       </div>
    </div>
  );
}
