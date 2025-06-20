"use client";

import * as React from "react";
import Link from "next/link";

import {cn} from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import BlogSearchBar from "./BlogSearchBar";
import {GenreDomain} from "@/stores/blog/genre.store";
import {useShallow} from "zustand/shallow";
import {BLOG_Q_PARAMS} from "@/lib/constants";

type GenreBase = {
    id: number;
    title: string;
    description?: string;
    href?: string;
}

type Genre = GenreBase & {
    children: GenreBase[];
};

function fromGenreDomainToMenuItem(genre1s:GenreDomain.Genre1Type[]): Genre[] {
    return  genre1s.map(g1 => {
        const urlParams = new URLSearchParams();
        urlParams.set(BLOG_Q_PARAMS.search, "")
        urlParams.set(BLOG_Q_PARAMS.page, "0");
        urlParams.set(BLOG_Q_PARAMS.genres, g1.genre2s.map(g2 => g2.id).join(","))
        return {
            id: g1.id,
            title: g1.name,
            description: g1.name,
            href: `/blog/search?${urlParams.toString()}`,
            children: g1.genre2s.map(g2 => {
                const qParams2 = new URLSearchParams();
                qParams2.set(BLOG_Q_PARAMS.search, "")
                qParams2.set(BLOG_Q_PARAMS.page, "0");
                qParams2.set(BLOG_Q_PARAMS.genres, `${g2.id}`)
                return {
                    id: g2.id,
                    title: g2.name,
                    description: g2.name,
                    href: `/blog/search?${qParams2.toString()}`,
                }
            })
        }
    })
}

export default function BlogNavMenu() {

    const [genre1s] = GenreDomain.useStore(useShallow(s =>
        [s.genre1s]))

    const menuItems: Genre[] = fromGenreDomainToMenuItem(genre1s);

    return (
        <div className="flex flex-row items-center justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.children.length > 0 ? (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        {item.title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            {item.children.map((subItem, subIndex) => (
                                                <ListItem
                                                    title={subItem.title}
                                                    href={subItem.href}
                                                    key={subIndex}>
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
                                            className={navigationMenuTriggerStyle()}>
                                            {item.title}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )}
                        </React.Fragment>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <BlogSearchBar/>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ComponentRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}>
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
