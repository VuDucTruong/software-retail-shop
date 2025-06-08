import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { RefObject } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "../ui/button";

type EditAvatarProps = {
  fileRef: RefObject<HTMLInputElement | null>;
  name: string;
  avatarHint: string; // Hint for the avatar
  defaultAvatar?: string | null; // Optional default avatar URL
  field?: ControllerRenderProps<any,any>;
};

export default function EditAvatarSection({
  fileRef,
  name,
  avatarHint,
  defaultAvatar = "/empty_img.png",
  field,
}: EditAvatarProps) {
  const [avatar, setAvatar] = React.useState<string | null>(null); // State to hold the avatar URL


  const handleButtonClick = () => {
    fileRef.current?.click();
  };
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    field?.onChange(file);
    if (file) {
      console.log("Selected file:", file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      {/* Just avatar display */}
      <div className="relative ring-border ring-offset-base-100 size-40 rounded-lg ring ring-offset-2">
        <Image
          alt="Avatar"
          fill
          sizes="100%"
          className="object-cover rounded-lg"
          src={avatar || defaultAvatar || "empty_img.png"} // Use the avatar URL or a default image
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
          {name}
        </Button>
      </div>
      <Separator orientation="vertical" className="!w-1 !bg-primary" />
      {/* Avatar hint */}
      <p className="whitespace-pre-line body-sm">{avatarHint}</p>
    </div>
  );
}
