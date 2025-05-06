"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import SearchCommandDialog from "@/components/common/SearchCommandDialog";
type Genre = {
  title: string;
  description?: string;
  href?: string;
  children: Genre[];
};
const menuItems: Genre[] = Array.from({ length: 6 }, (_, i) => ({
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  href: `/item${i + 1}`,
  children: Array.from({ length: i }, (_, j) => ({
    title: `Sub Item ${j + 1}`,
    description: `Description for sub item ${j + 1}`,
    href: `/item${i + 1}/sub${j + 1}`,
    children: [],
  })),
}));

export default function BlogNavMenu() {
  return (
    <div className="flex flex-row items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.children.length > 0 ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    
                  >
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {item.children.map((subItem, subIndex) => (
                        <ListItem
                          title={subItem.title}
                          href={subItem.href}
                          key={subIndex}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <Link href={item.href ?? ""} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </React.Fragment>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <SearchCommandDialog />
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
