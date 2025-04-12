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
import NavProduct from "./NavProduct";
import NavDashboard from "./NavDashboard";
import { adminMenu } from "@/config/constants";
import CommonNav from "./CommonNav";




export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>\
      {/* Logo place */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Avatar>
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>LOGO</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">Phoenix Shop</span>
              </a>
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
      <CommonNav data={adminMenu.navAdmin} />

      </SidebarContent>

      {/* User settings */}
      <SidebarFooter>
        <NavUser user={adminMenu.userSettings} />
      </SidebarFooter>
    </Sidebar>
  );
}
