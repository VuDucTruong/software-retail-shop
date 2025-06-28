import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
    className?: string;
    entityName?: string;
}

export default function SearchNotFound(props: Props) {
  const { className } = props;
  const t = useTranslations();
  return (
    <div className={cn("flex flex-col items-center gap-2" , className)}>
      <h3>{t("no_matching_x", {x: t(props?.entityName ?? "products")})}</h3>
      <p>{t("suggestion_for_search")}</p>
      <div className="relative w-full h-60">
        <Image
          alt="not found search"
          src={"/search-not-found.svg"}
          fill
          sizes="100%"
        />
      </div>
    </div>
  );
}
