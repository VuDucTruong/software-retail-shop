"use client";
import { ChangePassword, ChangePasswordSchema } from "@/api";
import CommonOTPInput from "@/components/common/CommonOTPInput";
import { ChangePasswordForm } from "@/components/security/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuthToast } from "@/hooks/use-auth-toast";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

export default function SecurityPage() {
  const t = useTranslations();
  const [tabValue, setTabValue] = React.useState("password");

  const form = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const [lastAction, status, error, changePassword, user, sendOTP] =
    useAuthStore(
      useShallow((state) => [
        state.lastAction,
        state.status,
        state.error,
        state.changePassword,
        state.user,
        state.sendOTP,
      ])
    );

  useAuthToast({
    lastAction,
    status,
    errorMessage: error || undefined,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      changePassword({
        email: user?.email ?? "",
        password: data.password ?? "",
        otp: data.otp ?? "",
      });
    })();
  };

  useEffect(() => {
    if (lastAction === "changePassword" && status === "success") {
      window.location.replace("/");
    }
  }, [lastAction, status]);

  return (
    <Card>
      <CardHeader>
        <h3>{t("pass_security")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("pass_security_description")}
        </p>
      </CardHeader>
      <CardContent>
        {tabValue === "password" && (
          <div className="flex flex-row items-center gap-5">
            <ChangePasswordForm
              form={form}
              onSubmit={() => {
                sendOTP(user?.email ?? "");
                setTabValue("otp");
              }}
            />
            <Separator orientation="vertical" />

            <div className="flex flex-col gap-2">
              <h4>{t("your_password")}</h4>
              <p className="whitespace-pre-line body-sm regular">
                {t("Input.change_password_hint")}
              </p>
            </div>
          </div>
        )}
        {tabValue === "otp" && (
          <div className="flex flex-col gap-4">
            <Button
              className="w-fit !px-0"
              variant={"ghost"}
              onClick={() => {
                setTabValue("password");
              }}
            >
              <ChevronLeft /> Quay lại
            </Button>
            <h4>{"Xác thực"}</h4>
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 flex flex-col px-2"
              >
                <FormField
                  control={form.control}
                  defaultValue=""
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Mã OTP"}</FormLabel>
                      <FormDescription>{`Một mã OTP đã được gửi đến email ${user?.email} của bạn để hoàn tất quá trình đổi mật khẩu`}</FormDescription>
                      <FormControl>
                        <CommonOTPInput
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-fit" type="submit">
                  {"Xác thực"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
