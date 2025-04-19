import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { LoginForm } from "./LoginForm";
import { Separator } from "@radix-ui/react-select";

export default function LoginTab({ isReset }: { isReset: boolean }) {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (isReset) {
      formRef.current?.reset();
    }
  }, [isReset]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Perform login logic here, e.g., API call
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col justify-start gap-2 max-w-xl">
        <p className="italic text-muted-foreground mb-6">
          {t("login_description")}
        </p>

        <LoginForm />

        <div className="flex items-center gap-1 my-2">
          <div className="w-full h-px bg-slate-400 rounded-full"></div>
          <div className="whitespace-nowrap text-muted-foreground font-medium">
            {t("login_with")}
          </div>
          <div className="w-full h-px bg-slate-400 rounded-full"></div>
        </div>
        <Image
          className="cursor-pointer self-center"
          alt="Google"
          src="/google.png"
          width={50}
          height={50}
        />
      </div>

      <Image
        alt="Login"
        className="rounded-xl"
        src="/login.jpg"
        width={500}
        height={500}
      />
    </div>
  );
}
