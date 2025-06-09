
import { ChangePasswordSchema } from "@/api";
import { useAuthToast } from "@/hooks/use-auth-toast";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import CongratulationSection from "../forgot-pass/CongratulationSection";
import OtpSection from "../forgot-pass/OtpSection";
import PasswordSection from "../forgot-pass/PasswordSection";
import EmailSection from "../forgot-pass/EmailSection";

export function ForgotPassowrdForm() {
  const [tabValue, setTabValue] = useState("email");

  const [status, lastAction, error, sendOTP, changePassword] = useAuthStore(
    useShallow((state) => [
      state.status,
      state.lastAction,
      state.error,
      state.sendOTP,
      state.changePassword,
    ])
  );

  useAuthToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  const form = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if(status === "success" && lastAction === "changePassword") {
      setTabValue("congratulation");
    }
  },[lastAction , status])

  useEffect(() => {
    if (tabValue !== "otp") return;
    const email = form.getValues("email")?.trim();
    if (email && email.length > 0) {
      sendOTP(email);
    }
  }, [tabValue , form , sendOTP]);

  if (tabValue === "otp") {
    return <OtpSection form={form} onSubmit={() => {
      changePassword({
            email: form.getValues("email")?.trim() || "",
            otp: form.getValues("otp")?.trim() || "",
            password: form.getValues("password")?.trim() || "",
          });
      
    }} onResend={()=>{
      const email = form.getValues("email")?.trim();
      if (email && email.length > 0) {
        sendOTP(email);
      }
    }} />;
  }

  if (tabValue === "password") {
    return (
      <PasswordSection
        form={form}
        onSubmit={() => {
          setTabValue("otp");
        }}
      />
    );
  }

  if (tabValue === "congratulation") {
    return <CongratulationSection />;
  }

  return <EmailSection form={form} onSubmit={() => setTabValue("password")} />;

 
}
