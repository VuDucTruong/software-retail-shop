"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";

import { UserCreate, UserCreateSchema } from "@/api";
import EditAvatarSection from "@/components/profile/EditAvatarSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserToast } from "@/hooks/use-user-toast";
import { flattenObject } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { RiResetLeftFill } from "react-icons/ri";

export default function CreateStaffPage() {
  const t = useTranslations();

  const [createUser, lastAction, status, error] = useUserStore(
    useShallow((state) => [
      state.createUser,
      state.lastAction,
      state.status,
      state.error,
    ])
  );

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


  const handleSubmit = () => {
    form.handleSubmit((data) => {
      const flatData = flattenObject(data);
      createUser(flatData as UserCreate);
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("create_admin")}</h2>
          <Button
            variant={"destructive"}
            onClick={() => {
              form.reset();
            }}
          >
            <RiResetLeftFill /> {t("Reset")}
          </Button>
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
                    field={field}
                    avatarHint={t("image_hint")}
                    name="profile.avatar"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <CommonInputOutline required title={"Email"}>
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <CommonInputOutline title={t("Password")} required>
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="profile.fullName"
              render={({ field }) => (
                <CommonInputOutline title={t("Name")} required>
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <CommonInputOutline title={t("Role")} required>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STAFF">{t("Staff")}</SelectItem>
                      <SelectItem value="ADMIN">{t("Manager")}</SelectItem>
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
