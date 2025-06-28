import { ArrowLeftCircle } from "lucide-react";
import clsx from "clsx";
import ThreeDButton from "@/components/common/ThreeDButton";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

type NavPostLinkProps = {
  id: number;
  title: string;
  direction: "prev" | "next";
  disabled?: boolean;
};

export default function NavPostLink({
  direction,
  title,
  id,
  disabled = false,
}: NavPostLinkProps) {
  const isPrev = direction === "prev";
    const t = useTranslations();
  return (
    <Link href={`/blog/${id}`}>
      <ThreeDButton className={clsx("flex flex-col gap-2 w-full", isPrev ? "items-start" : "items-end" , disabled && "opacity-50 pointer-events-none")}>
        <div
          className={clsx(
            "text-sm flex gap-2 items-center",
            isPrev ? "flex-row-reverse" : "flex-row"
          )}
        >
          {isPrev ? t('previous_blog') : t('next_blog')}
          <ArrowLeftCircle className={isPrev ? "" : "rotate-180"} />
        </div>
        <div className={isPrev ? "text-start" : "text-end"}>{title}</div>
      </ThreeDButton>
    </Link>
  );
}
