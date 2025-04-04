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

export function ChangePasswordForm() {
  const t = useTranslations();

  const formSchema = z
    .object({
      new_password: z
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
    .refine((data) => data.new_password === data.comfirm_password, {
      message: t("Input.error_pass_not_match"),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
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
        className="space-y-6 flex flex-col overflow-y-auto px-2"
      >
        {/* Password */}
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("new_password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("Input.new_password_placeholder")}
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

        <Button type="submit">{t("change_password")}</Button>
      </form>
    </Form>
  );
}
