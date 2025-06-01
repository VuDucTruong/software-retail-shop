"use client";

import { LoginRequest, LoginRequestSchema } from "@/api";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit?: (values: LoginRequest) => void;
};

export function LoginForm({ onSubmit }: Props) {
  const t = useTranslations();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    form.handleSubmit((data) => {
      onSubmit?.(data);
    })();
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
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
        <Link href={"/forgot-pass"} className="hover:underline text-blue-500">
          {t("forgot_password")}
        </Link>
        <Button type="submit">{t("Login")}</Button>
      </form>
    </Form>
  );
}
