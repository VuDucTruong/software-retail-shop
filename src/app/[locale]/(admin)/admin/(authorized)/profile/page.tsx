"use client";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { User } from "@/api";

import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import ChangePassDialog from "@/components/profile/ChangePassDialog";
import { useUserStore } from "@/stores/user.store";
import { useAuthStore } from "@/stores/auth.store";
import LoadingPage from "@/components/special/LoadingPage";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const t = useTranslations();

  const getProfile = useUserStore((state) => state.getProfile);
  const lastAction = useUserStore((state) => state.lastAction);
  const error = useUserStore((state) => state.error);
  const status = useUserStore((state) => state.status);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (status === "error" && lastAction === "getProfile") {
      toast.error(error);
    }
  }, [status, lastAction, error]);

  const fileRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const avatar = fileRef.current?.files?.[0];
    const name = nameRef.current?.value;

    const data = {
      avatar,
      name,
    };

    console.log(data);
  };
  const gridItems = [
    {
      title: t("Email"),
      value: user?.email,
    },
    {
      title: t("Name"),
      value: user?.profile.fullName,
    },
    {
      title: t("Role"),
      value: user?.role,
    },
    {
      title: t("participate_date"),
      value: user?.createdAt.toString(),
    },
  ];
  if (status === "success" && lastAction === "getProfile") {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3>{t("user_profile")}</h3>
          <ChangePassDialog />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Genenral information */}
          <div className="grid grid-cols-3 gap-3">
            {gridItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-l-3 border-primary pl-4"
              >
                <p className="font-medium text-lg">{item.title}</p>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
          <Separator />

          {/* Avatar section */}
          <EditAvatarSection
            avatarHint={t("image_hint")}
            name={t("change_avatar")}
            ref={fileRef}
            defaultAvatar={user?.profile.imageUrl ?? undefined}
          />

          {/* Information can be changed in here ! */}
          <h4 className="py-3">{t("edit_personal_info")}</h4>
          <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
            <Input
              placeholder={t("Name")}
              className="w-1/3"
              name="name"
              type="text"
              ref={nameRef}
              pattern="^[A-Za-z]+(?: [A-Za-z]+)*$"
              required
            />

            <Button variant={"default"} className="w-fit">
              {t("save_changes")}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return LoadingPage();
}
