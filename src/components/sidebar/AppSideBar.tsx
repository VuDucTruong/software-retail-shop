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

import { adminMenu } from "@/lib/constants";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommonNav from "./CommonNav";
import { NavUser } from "./NavUser";
import { useAuthStore } from "@/stores/auth.store";
import { getRoleWeight } from "@/lib/utils";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const user = useAuthStore((state) => state.user);

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
              <Link href="/admin">
                <Avatar>
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>LOGO</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">Phoenix Shop</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main menu content */}
      <SidebarContent>
        <CommonNav data={adminMenu.navDashboard} />
        <CommonNav data={adminMenu.navProduct} />
        <CommonNav data={adminMenu.navCustomer} />
        <CommonNav data={adminMenu.navStaff} />
        {
          getRoleWeight(user?.role ?? "CUSTOMER") >= getRoleWeight("ADMIN") && (
            <CommonNav data={adminMenu.navAdmin} />
          )
        }
      </SidebarContent>

      {/* User settings */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
