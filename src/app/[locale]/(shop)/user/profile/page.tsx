'use client';
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function ProfilePage() {
  const t = useTranslations();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const avatar = fileRef.current?.files?.[0];
        const name = nameRef.current?.value;

        const data = {
            avatar,
            name,
        }

        console.log(data);
    }
  const gridItems = [
    {
      title: t("Email"),
      value: "haha@gmail.com",
    },
    {
      title: t("Name"),
      value: "Nguyen Van A",
    },
    {
      title: t("customer_group"),
      value: "Member",
    },
    {
      title: t("accumulated_points"),
      value: "9.000",
    },
    {
      title: t("participate_date"),
      value: "2017-08-03 15:14:40",
    },
  ];

  return (
    <Card>
      <CardHeader>
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

        {/* Avatar section */}
        <EditAvatarSection avatarHint={t('image_hint')} name={t('change_avatar')} fileRef={fileRef}/>

        {/* Information can be changed in here ! */}
        <h4 className="py-3">{t('edit_personal_info')}</h4>
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
