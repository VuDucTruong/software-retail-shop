"use client";
import { ForgotPassowrdForm } from "@/components/auth/ForgotPassowrdForm";

export default function LoginPage() {

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
