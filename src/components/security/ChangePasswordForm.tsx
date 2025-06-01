"use client";

import { ChangePassword, ChangePasswordSchema } from "@/api";
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
import { useForm } from "react-hook-form";

type Props = {
  form: ReturnType<typeof useForm<ChangePassword>>;
  onSubmit?: () => void;
};

export function ChangePasswordForm(props: Props) {
  const { form } = props;
  const t = useTranslations();


  return (
    <div className="flex flex-col gap-4 w-1/3">
      <h4>{t("change_password")}</h4>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit((data) => {
              props.onSubmit?.();
            })();
          }}
          className="space-y-6 flex flex-col overflow-y-auto px-2"
        >
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
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

          <Button disabled={(form.watch("password")?.length ?? 0 ) === 0} type="submit">{t("Continue")}</Button>
        </form>
      </Form>
    </div>
  );
}
