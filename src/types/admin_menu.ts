import { IconType } from "react-icons/lib";

export type AdminMenuItem = {
    title: string;
    url: string;
    icon?: IconType;
    items?: AdminMenuItem[];
}

export type AdminUserSettings = {
    name: string;
    email: string;
    avatar: string;
}

export type AdminMenu = {
    userSettings: AdminUserSettings;
    navDashboard: AdminMenuItem;
    navProduct: AdminMenuItem;
  };