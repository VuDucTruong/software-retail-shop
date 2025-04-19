"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import Link from "next/link";

export function RegisterForm() {
  const t = useTranslations();

  const formSchema = z
    .object({
      username: z
        .string()
        .min(1, {
          message: t("Input.error_name_empty"),
        })
        .min(3, {
          message: t("Input.error_name_length"),
        }),
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
      comfirm_password: z
        .string()
        .min(1, {
          message: t("Input.error_password_empty"),
        })
        .min(8, {
          message: t("Input.error_pass_length"),
        }),
    })
    .refine((data) => data.password === data.comfirm_password, {
      message: t("Input.error_pass_not_match"),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      comfirm_password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col overflow-y-scroll px-1"
      >
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormDescription>{t("Input.name_hint")}</FormDescription>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("Input.name_placeholder")}
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
              <FormDescription>{t("Input.email_hint")}</FormDescription>
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
              <FormDescription>{t("Input.password_hint")}</FormDescription>
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
          name="comfirm_password"
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
  );
}
