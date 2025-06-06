"use client";

import { RegisterRequest, RegisterRequestSchema } from "@/api";
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
import { useAuthToast } from "@/hooks/use-auth-toast";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";



export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  

  const [register, lastAction, status, error,sendOTP] = useAuthStore(
    useShallow((state) => [
      state.register,
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

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      register(data);
    })();
  };

  useEffect(() => {
    if (lastAction === "register" && status === "success") {
      const urlParams = new URLSearchParams();
      urlParams.set("email", form.getValues("email"));
      sendOTP(form.getValues("email"));
      router.push(`/register/verify?${urlParams.toString()}`);
    }
  }, [lastAction, status]);

  return (
    <div className="flex flex-col justify-start gap-2 max-w-xl ">
      <p className="italic text-sm text-muted-foreground mb-2">
        {t("register_description")}
      </p>
      <Form {...form}>
        <form
          onSubmit={handleRegister}
          className="space-y-6 flex flex-col px-1"
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
