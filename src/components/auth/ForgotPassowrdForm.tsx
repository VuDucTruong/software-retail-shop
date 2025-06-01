import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordSchema, PasswordSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import EmailSection from "../forgot-pass/EmailSection";
import OtpSection from "../forgot-pass/OtpSection";
import CongratulationSection from "../forgot-pass/CongratulationSection";
import PasswordSection from "../forgot-pass/PasswordSection";
import { useAuthStore } from "@/stores/auth.store";
import { useShallow } from "zustand/shallow";
import { useLoginToast } from "@/hooks/use-login-toast";
import { set } from "lodash";

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

  useLoginToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  const form = useForm({
    resolver: zodResolver(ChangePasswordSchema),
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
  }, [tabValue]);

  if (tabValue === "otp") {
    return <OtpSection form={form} onSubmit={() => {
      changePassword({
            email: form.getValues("email")?.trim() || "",
            otp: form.getValues("otp")?.trim() || "",
            password: form.getValues("password")?.trim() || "",
          });
      
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
