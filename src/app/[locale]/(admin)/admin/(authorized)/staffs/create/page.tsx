"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";

import {
  BlogCreate,
  BlogCreateSchema,
  UserCreate,
  UserCreateSchema,
} from "@/api";
import GenreDropdown from "@/components/blog/GenreDropdown";
import ProductDescriptionInput from "@/components/product/ProductDescriptionInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";
import { getDateTimeLocal } from "@/lib/date_helper";
import { useBlogStore } from "@/stores/blog.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { useUserStore } from "@/stores/user.store";
import { useUserToast } from "@/hooks/use-user-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { flattenObject } from "@/lib/utils";

export default function CreateStaffPage() {
  const t = useTranslations();

  const [createUser, lastAction, status, error,resetStatus] = useUserStore(
    useShallow((state) => [
      state.createUser,
      state.lastAction,
      state.status,
      state.error,
      state.resetStatus,
    ])
  );

  useEffect(() => {
    if (status !== "idle") {
      resetStatus();
    }
  },[])

  useUserToast({
    lastAction,
    status,
    errorMessage: error || undefined,
  });

  const form = useForm<UserCreate>({
    defaultValues: {
      email: "",
      password: "",
      profile: {
        avatar: null,
        fullName: "",
      },
      role: "",
      disableDate: null,
      enableDate: null,
      isVerified: true,
    },
    resolver: zodResolver(UserCreateSchema),
    mode: "onSubmit",
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    form.handleSubmit((data) => {
      const flatData = flattenObject(data);
      createUser(flatData as UserCreate)
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{"Tạo quản trị viên"}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className=" grid grid-cols-3 space-x-4 gap-6"
          >
            {/* Image Upload */}

            <FormField
              control={form.control}
              name="profile.avatar"
              render={({ field }) => (
                <FormItem className="col-span-3">
                    <EditAvatarSection
                  fileRef={fileRef}
                  field={field}
                  avatarHint={t("image_hint")}
                  name={"Đặt avatar"}
                />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <CommonInputOutline
                  required
                  title={"Email"}
                >
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <CommonInputOutline
                  title="Mật khẩu"
                  required
                >
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="profile.fullName"
              render={({ field }) => (
                <CommonInputOutline title={"Tên"} required>
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <CommonInputOutline title={"Vai trò"} required>
                  <Select
                    
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STAFF">Nhân viên</SelectItem>
                      <SelectItem value="ADMIN">Quản lý</SelectItem>
                    </SelectContent>
                  </Select>
                </CommonInputOutline>
              )}
            />

            <div className="col-start-3 row-start-4">
                <Button
              className="w-full bg-green-400 hover:bg-green-500"
              type="submit"
            >
              {t("Create")}
            </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
