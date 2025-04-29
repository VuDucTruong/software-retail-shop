import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { User } from "@/models/user/user";
import { userAgent } from "next/server";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import CommonDisplayInput from "@/components/CommonDisplayInput";
import { StatusBadge } from "@/components/StatusBadge";

type UserDetailDialogProps = {
  user: User;
};

export default function UserDetailDialog({ user }: UserDetailDialogProps) {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{t("user_profile")}</DialogTitle>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 flex">
              <Avatar className="size-32 rounded-full border border-border ">
                <AvatarImage
                  className="object-cover rounded-full size-full"
                  src={user.profile.imageUrl}
                  alt={user.profile.fullName}
                />
                <AvatarFallback className="bg-gray-400">
                  {user.profile.fullName.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

             
            </div>

            <CommonDisplayInput title="ID" value={user.id.toString()} />
            <CommonDisplayInput
              title={t("Name")}
              value={user.profile.fullName}
            />
            <CommonDisplayInput title="Email" value={user.profile.email} />
            <CommonDisplayInput title={t("Role")} value={user.role} />
            <CommonDisplayInput
              title={t("registration_date")}
              value={user.createdAt!}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium capitalize">
                {t("Status")}
              </label>
              <StatusBadge status={user.isActive ? "active" : "banned"} />
              {user.isActive ? null : (
                <span className="italic text-muted-foreground text-xs">
                  {t("banned_in_x", { x: user.disableDate })}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
