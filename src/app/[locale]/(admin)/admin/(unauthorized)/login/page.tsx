"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AuthPage() {
  const t = useTranslations();

  const formSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: t("Input.error_email_empty"),
      })
      .email({
        message: t("Input.error_email_format"),
      }),
    password: z
      .string()
      .min(1, {
        message: t("Input.error_password_empty"),
      })
      .min(8, {
        message: t("Input.error_pass_length"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
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
  );
}
