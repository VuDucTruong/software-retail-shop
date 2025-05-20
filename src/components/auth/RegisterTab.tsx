import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RegisterForm } from "./RegisterForm";


export default function RegisterTab() {
  const t = useTranslations();
  return (
    <div className="flex flex-row gap-4 max-h-[500px]">
      
      <RegisterForm/>
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
