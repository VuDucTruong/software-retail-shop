"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth.store";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function NavUser() {
  const { isMobile } = useSidebar();
  const t = useTranslations();
  

  const [logout , user , getMe] = useAuthStore(useShallow(state => [
    state.logout,
    state.user,
    state.getMe,
  ]))

  useEffect(() => {
    getMe();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.profile.imageUrl ?? "/empty_user.png"}
                  alt={user?.profile.fullName}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.profile.fullName
                    .split(" ")
                    .at(-1)
                    ?.substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.profile.fullName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <HiDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.profile.imageUrl ?? "/empty_user.png"}
                    alt={user?.profile.fullName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.profile.fullName
                      .split(" ")
                      .at(-1)
                      ?.substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.profile.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={"/admin/profile"}
                  className="flex items-center gap-2"
                >
                  <FaUserCircle />
                  {t("Account")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IoNotifications />
                {t("Notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <MdLogout />
              {t("Logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
