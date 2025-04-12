"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { AdminMenuItem } from "@/types/admin_menu";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavCommon({ data }: { data: AdminMenuItem }) {
  const t = useTranslations();
  const pathName = usePathname();

  const currentPath = pathName.split("/").at(-1);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(data.title) + " Section"}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data.items && data.items.length > 0 ? (
            <>
              {data.items?.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  
                >
                  <SidebarMenuButton asChild tooltip={item.title} className={`${
                    currentPath === item.url
                      ? "bg-primary hover:bg-primary/40 text-white"
                      : ""
                  }`}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          ) : (
            <SidebarMenuItem key={data.title}>
              <SidebarMenuButton
                asChild
                tooltip={data.title}
                className={`${
                  currentPath === data.url
                    ? "bg-primary rounded-lg text-white  "
                    : ""
                }`}
              >
                <Link href={data.url}>
                  {data.icon && <data.icon />}
                  <span>{data.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
