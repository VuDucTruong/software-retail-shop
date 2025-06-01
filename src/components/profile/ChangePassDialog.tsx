
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { useTranslations } from "next-intl";
import {  useForm } from "react-hook-form";
import { Form,FormField } from "@/components/ui/form";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePassword, ChangePasswordSchema } from "@/api";
import { useAuthStore } from "@/stores/auth.store";



export default function ChangePassDialog() {
  const t = useTranslations();
  const changePassword = useAuthStore((state) => state.changePassword);
  
  const form = useForm<ChangePassword>({
    defaultValues: {
        password: "",
        confirmPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });


  const onSubmit = async (data: ChangePassword) => {
    try {
      // Call your API to change the password here
      console.log(data);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {
        if (open) {
            form.reset();
        }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
            <Edit3 className="h-4 w-4" />
            {t("change_password")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle className="capitalize text-xl">{t("change_password")}</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-1/2 mt-8">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <CommonInputOutline title={t("new_password")}>
                    <Input type="password" {...field} />
                  </CommonInputOutline>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <CommonInputOutline title={t("confirm_password")}>
                    <Input type="password" {...field} />
                  </CommonInputOutline>
                )}
              />

              <Button type="submit" className="mt-4 w-fit">
                {t("change_password")}
                </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
