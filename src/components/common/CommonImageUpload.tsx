"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  name: string;
  defaultImageUrl?: string;
};

export const CommonImageUpload = ({ name, defaultImageUrl }: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const { watch, control } = useFormContext();
  const t = useTranslations();
  const image = watch(name);

  React.useEffect(() => {
    if (!image) {
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [image]);


  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormLabel>{t("upload_image")}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setPreview(url);
                } else {
                  setPreview(null);
                }
                onChange(file);
              }}
            />
          </FormControl>
          {typeof (preview || defaultImageUrl) === "string" &&
            (preview || defaultImageUrl)?.trim() && (
              <Image
                src={preview || defaultImageUrl || "/empty_img.png"}
                alt="Preview"
                width={200}
                height={0}
                className="h-auto mt-2 rounded border"
              />
            )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
