"use client";
import { LoginRequest, LoginRequestSchema } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginToast } from "@/hooks/use-login-toast";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const t = useTranslations();
  const login = useAuthStore((state) => state.login);
  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("Reset status");
    useAuthStore.getState().resetStatus();
  }
  , []);

  function onSubmit(request: LoginRequest) {
    login(request)
  }



  useLoginToast({
    status: useAuthStore((state) => state.status),
    lastAction: useAuthStore((state) => state.lastAction),
    errorMessage: useAuthStore((state) => state.error) || undefined,
  });


  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-2">
          <h2>{t("Login")}</h2>
          <div className="relative size-25 ">
            <Image src={"/logo.png"} alt="LOGO" fill className="object-cover" />
          </div>
          <p className="font-normal text-sm text-muted-foreground">
            {t("welcome_to_admin")}
          </p>
          
        </CardTitle>
      </CardHeader>

      <CardContent>
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
            <Button type="submit">{t("Login")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </main>
  );
}



