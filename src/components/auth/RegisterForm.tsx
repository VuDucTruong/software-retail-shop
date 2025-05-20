"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { RegisterRequest, RegisterRequestSchema } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useRef, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";
import ResendOTPBtn from "./ResendOTPBtn";

export function RegisterForm() {
  const t = useTranslations();
  const [isOTP, setIsOTP] = useState(false);
  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });
  const otpRef = useRef<HTMLInputElement>(null);

  const register = useAuthStore((state) => state.register);
  const sendOTP = useAuthStore((state) => state.sendOTP);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    form.handleSubmit((data) => {
      //setIsOTP(true);

      register(data)
    })();
  }

  if (isOTP) {

    useEffect(() => {
      sendOTP(form.getValues("email"))
    },[]);

    return (
      <div className="flex flex-col gap-4 justify-center">
        <div className="flex items-center justify-start">
          <Button className="flex items-center" variant={"ghost"} onClick={()=>setIsOTP(false)}><BiArrowBack /> Quay lại</Button>
        </div>
        <figure className="relative h-52">
          <Image alt="OTP" src={"/otp.jpg"} fill sizes="100%" className="object-contain rounded-md"/>
        </figure>
        <div className="text-muted-foreground flex flex-col items-center justify-center">
          Nhập mã OTP đã được gửi đến email
          <span className="text-black font-medium">{form.getValues("email")}</span>
        </div>
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            required
            ref={otpRef}
            inputMode="numeric"
            pattern="[0-9]*"
          >
            <InputOTPGroup>
              <InputOTPSlot className="size-15 text-4xl" index={0} />
              <InputOTPSlot className="size-15 text-4xl" index={1} />
              <InputOTPSlot className="size-15 text-4xl" index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot className="size-15 text-4xl" index={3} />
              <InputOTPSlot className="size-15 text-4xl" index={4} />
              <InputOTPSlot className="size-15 text-4xl" index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          onClick={() => {
            
          }}
        >
          Xác nhận
        </Button>
          <div className="flex items-center justify-center">
            <ResendOTPBtn onResend={()=>sendOTP(form.getValues('email'))} initialCountdown={30}/>
          </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start gap-2 max-w-xl ">
      <p className="italic text-muted-foreground mb-6">
        {t("register_description")}
      </p>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="space-y-6 flex flex-col overflow-y-scroll px-1"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Name")}</FormLabel>
                <FormDescription>{"Tên phải từ 6 - 40 kí tự"}</FormDescription>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={"Nhập tên của bạn"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormDescription>
                  {"Email phải là một email hợp lệ để có thể nhận được mã OTP"}
                </FormDescription>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("Input.email_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Password")}</FormLabel>
                <FormDescription>
                  {"Mật khẩu phải từ 6-40 kí tự"}
                </FormDescription>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("Input.password_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Again */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirm_password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("Input.confirm_password_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{t("create_account")}</Button>
        </form>
      </Form>
    </div>
  );
}
