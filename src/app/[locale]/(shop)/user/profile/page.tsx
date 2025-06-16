"use client";
import { UserProfileUpdate, UserProfileUpdateSchema } from "@/api";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import LoadingPage from "@/components/special/LoadingPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useClientUserStore } from "@/stores/cilent/client.user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthToast } from "@/hooks/use-auth-toast";

export default function UserProfilePage() {
  const t = useTranslations();

  const getProfile = useClientUserStore((state) => state.getUser);
  const updateProfile = useClientUserStore((state) => state.updateProfile);
  const lastAction = useClientUserStore((state) => state.lastAction);
  const error = useClientUserStore((state) => state.error);
  const status = useClientUserStore((state) => state.status);
  const user = useClientUserStore((state) => state.user);
  const fileRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useAuthToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit", form.getValues());

    form.handleSubmit((data) => {
      updateProfile(data);
    })();
  };

  const form = useForm<UserProfileUpdate>({
    defaultValues: {
      fullName: user?.profile.fullName ?? "",
    },
    resolver: zodResolver(UserProfileUpdateSchema),
  });


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

  useEffect(() => {
    if (user) {
      form.setValue("fullName", user.profile.fullName);
    }
  }, [user, form]);

  if (status !== "success" && lastAction === "getUser") {
    return <LoadingPage />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3>{t("user_profile")}</h3>
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

        {/* Information can be changed in here ! */}
        <h4 className="py-3">{t("edit_personal_info")}</h4>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
            {/* Avatar section */}
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <EditAvatarSection
                  field={field}
                  avatarHint={t("image_hint")}
                  name="image"
                  defaultAvatar={user?.profile.imageUrl ?? undefined}
                />
              )}
            />

            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input className="w-1/3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant={"default"}
              className="w-fit"
              disabled={
                status === "loading" ||
                (form.watch("image") === undefined &&
                  form.watch("fullName")?.trim() === user?.profile.fullName)
              }
            >
              {t("save_changes")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
