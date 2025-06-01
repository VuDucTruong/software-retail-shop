"use client";
import { UserProfileUpdate, UserProfileUpdateSchema } from "@/api";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import ChangePassDialog from "@/components/profile/ChangePassDialog";
import LoadingPage from "@/components/special/LoadingPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { useLoginToast } from "@/hooks/use-login-toast";


export default function AdminProfilePage() {
  const t = useTranslations();

  const [status , lastAction , error , user, getMe , updateProfile] = useAuthStore(useShallow(state => [
    state.status,
    state.lastAction,
    state.error,
    state.user,
    state.getMe,
    state.updateProfile,
  ]))


  const fileRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    getMe();
  }, []);

  useLoginToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  useEffect(() => {
    if(status === "success" && lastAction === "changePassword") {
      window.location.reload();
    }
  }, [status, lastAction]);

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit" , form.getValues());

    form.handleSubmit(data => {
      updateProfile(data)
    })()
  };

  const form = useForm<UserProfileUpdate>({
    defaultValues: {
      fullName: user?.profile.fullName,
    },
    resolver: zodResolver(UserProfileUpdateSchema),
  });

  useEffect(() => {
    form.reset({
      fullName: user?.profile.fullName,
    });
  } , [user]);

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

  useEffect(() => {},[]);

  if (status !== "success" && lastAction === "getMe") {
    return LoadingPage();
  }


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
                  fileRef={fileRef}
                  field={field}
                  avatarHint={t("image_hint")}
                  name={t("change_avatar")}
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
