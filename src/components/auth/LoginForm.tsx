"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LoginRequest, LoginRequestSchema } from "@/api";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useLoginToast } from "@/hooks/use-login-toast";
import { useUserStore } from "@/stores/user.store";
import { useShallow } from "zustand/shallow";

export function LoginForm() {
  const t = useTranslations();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, status, lastAction, error] = useAuthStore(useShallow((state) => [
    state.login,
    state.status,
    state.lastAction,
    state.error,
  ]));
  
  function onSubmit(values: LoginRequest) {
    login(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
        <Link href={"/"} className="hover:underline text-blue-500">
          {t("forgot_password")}
        </Link>
        <Button type="submit">{t("Login")}</Button>
      </form>
    </Form>
  );
}
