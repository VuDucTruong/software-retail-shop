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
import { usePathname, useRouter } from "@/i18n/navigation";
import SearchCommandDialog from "@/components/common/SearchCommandDialog";
import { CommonSelect } from "../common/CommonSelect";
import { languages } from "@/lib/constants";

export default function AdminHeader() {
  const pathName = usePathname();
  const pathNameArray = pathName.split("/").filter((item) => item !== "" && item !== "admin");

  // Create breadcrumb segments with full path
  const breadcrumbs = pathNameArray.map((segment, index) => {
    const href = '/admin/' + pathNameArray.slice(0, index + 1).join('/');
    return {
      label: decodeURIComponent(segment.replace(/-/g, " ")),
      href,
    };
  });

    const router = useRouter();
  
    const switchLanguage = (locale: string) => {
      const newPath = `/${locale}${pathName.substring(3)}`; // Change locale in the URL
      router.replace(newPath);
    };

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">HOME</BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbSeparator className="hidden md:block" />
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
                    defaultValue={languages[0]}
                    onChange={(value) => {
                      switchLanguage(value);
                    }}
                  />
    </header>
  );
}
