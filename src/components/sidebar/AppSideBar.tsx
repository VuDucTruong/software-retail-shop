"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavUser } from "./NavUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { adminMenu } from "@/config/constants";
import CommonNav from "./CommonNav";
import { Skeleton } from "../ui/skeleton";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props} className="w-64">
      {/* Logo place */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {!mounted ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <a href="/admin">
                  <Avatar>
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback>LOGO</AvatarFallback>
                  </Avatar>
                  <span className="text-base font-semibold">Phoenix Shop</span>
                </a>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main menu content */}
      <SidebarContent>
        {mounted ? (
          <>
            <CommonNav data={adminMenu.navDashboard} />
            <CommonNav data={adminMenu.navProduct} />
            <CommonNav data={adminMenu.navCustomer} />
            <CommonNav data={adminMenu.navStaff} />
            <CommonNav data={adminMenu.navAdmin} />
          </>
        ) : (
          <div className="flex flex-col gap-6 mt-8 mx-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        )}
      </SidebarContent>

      {/* User settings */}
      <SidebarFooter>
        {mounted ? (
          <NavUser user={adminMenu.userSettings} />
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
