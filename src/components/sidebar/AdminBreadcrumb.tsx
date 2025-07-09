'use client'

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { CommonSelect } from "../common/CommonSelect";
import { languages } from "@/lib/constants";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

export default function AdminHeader() {
  const pathName = usePathname();
  const pathNameArray = pathName.split("/").filter((item) => item !== "");

  // Create breadcrumb segments with full path
  const breadcrumbs = pathNameArray.map((segment, index) => {
  
    const href = '/admin/' + pathNameArray.slice(1,index+1).join('/');
    return {
      label: decodeURIComponent(segment.replace(/-/g, " ")),
      href,
    };
  });
  const locale = useLocale();

    const router = useRouter();
  
    const switchLanguage = (locale: string) => {
      const newPath = `/${locale}${pathName}`;
      router.replace(newPath);
    };

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label.toUpperCase()}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label.toUpperCase()}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <SearchCommandDialog /> */}
      <CommonSelect
                    data={languages}
                    defaultValue={locale}
                    onChange={(value) => {
                      switchLanguage(value);
                    }}
                  />
    </header>
  );
}
