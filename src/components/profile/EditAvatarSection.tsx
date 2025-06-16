import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type EditAvatarProps = {
  name: string;
  avatarHint: string; // Hint for the avatar
  defaultAvatar?: string; // Optional default avatar URL
  field?: ControllerRenderProps<any, any>;
  avatarClassname?: string; // Optional class name for the avatar image
};

export default function EditAvatarSection({
  name,
  avatarHint,
  defaultAvatar = "/empty_img.png",
  field,
  avatarClassname, // Default class name for the avatar image
}: EditAvatarProps) {
  const t = useTranslations();
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const {watch} = useFormContext();
  const image = watch(name);

  const handleButtonClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
    field?.onChange(file);
  };

  React.useEffect(() => {
    if (!image) {
      setPreview(null);
      console.log("No image selected");
    }
  }, [image]);

  return (
    <div className="flex flex-row gap-4 items-center">
      {/* Just avatar display */}
      <div
        className={cn(
          "relative ring-border ring-offset-base-100 size-40 rounded-lg ring ring-offset-2",
          avatarClassname
        )}
      >
        <Image
          alt="Avatar"
          fill
          sizes="100%"
          className="object-contain rounded-lg"
          src={preview || defaultAvatar}
        />
      </div>
      {/* Change avatar button */}
      <div className="flex flex-col items-center gap-4">
        {/* Hidden file input */}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={(e) => {
            field?.ref(e);
            fileRef.current = e;
          }}
          {...fileRef}
        />
        {/* Clickable Button */}
        <Button
          variant="outline"
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary w-fit"
        >
          {t("upload_image")}
        </Button>
      </div>
      <Separator orientation="vertical" className="!w-1 !bg-primary" />
      {/* Avatar hint */}
      <p className="whitespace-pre-line body-sm">{avatarHint}</p>
    </div>
  );
}
