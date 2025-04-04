import { ChangePasswordForm } from "@/components/security/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import React from "react";

export default function SecurityPage() {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <h3>{t("pass_security")}</h3>
        <p className="font-normal italic text-muted-foreground">
          {t("pass_security_description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-5">
          <div className="flex flex-col gap-4 w-1/3">
            <h4>{t("change_password")}</h4>

            <ChangePasswordForm />
          </div>

          <Separator orientation="vertical" />

          <div className="flex flex-col gap-2">
            <h4>{t("your_password")}</h4>
            <p className="whitespace-pre-line body-sm regular">
              {t("Input.change_password_hint")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
