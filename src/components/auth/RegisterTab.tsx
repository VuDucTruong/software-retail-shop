import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RegisterForm } from "./RegisterForm";


export default function RegisterTab({ isReset }: { isReset: boolean }) {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (isReset) {
      formRef.current?.reset();
    }
  }, [isReset]);
  return (
    <div className="flex flex-row gap-4 max-h-[500px]">
      <div className="flex flex-col justify-start gap-2 max-w-xl ">
        <p className="italic text-muted-foreground mb-6">{t("register_description")}</p>
        <RegisterForm/>
      </div>
      <Image

        alt="Register Poster"
        className="rounded-xl h-fit"
        src="/register.jpg"
        width={500}
        height={500}
      />
    </div>
  );
}
