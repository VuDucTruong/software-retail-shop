"use client";


import { userOptions } from "@/config/constants";
import { usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="flex flex-row gap-2 main-container">
      <div className="flex flex-col rounded-lg overflow-hidden bg-background shadow border border-border h-fit">
        {userOptions.map((option, index) => (
          <div
            key={index}
            className={clsx(
              "flex flex-row items-center w-[250px] gap-3 p-4 cursor-pointer border-l-6 hover:bg-gray-100 hover:font-bold border-b border-b-gray-300",
              pathName.includes(option.href) ? "border-l-primary font-bold text-primary" : "border-l-transparent"
            )}
            onClick={() => router.push(option.href)}
          >
            <option.icon className="size-5" /> {t(option.title)}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full">
      {children}
      </div>
    </div>
  );
}
