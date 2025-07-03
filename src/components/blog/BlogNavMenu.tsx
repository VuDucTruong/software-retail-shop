"use client";

import * as React from "react";
import Link from "next/link";

import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import BlogSearchBar from "./search/BlogSearchBar";
import { GenreDomain } from "@/stores/blog/genre.store";
import { useShallow } from "zustand/shallow";
import { BLOG_Q_PARAMS, languages } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { CommonSelect } from "../common/CommonSelect";

type GenreBase = {
  id: number;
  title: string;
  description?: string;
  href?: string;
};

type Genre = GenreBase & {
  children: GenreBase[];
};

function fromGenreDomainToMenuItem(genre1s: GenreDomain.Genre1Type[]): Genre[] {
  return genre1s.map((g1) => {
    const urlParams = new URLSearchParams();
    urlParams.set(BLOG_Q_PARAMS.search, "");
    urlParams.set(BLOG_Q_PARAMS.page, "0");
    urlParams.set(
      BLOG_Q_PARAMS.genres,
      g1.genre2s.map((g2) => g2.id).join(",")
    );
    return {
      id: g1.id,
      title: g1.name,
      description: g1.name,
      href: `/blog/search?${urlParams.toString()}`,
      children: g1.genre2s.map((g2) => {
        const qParams2 = new URLSearchParams();
        qParams2.set(BLOG_Q_PARAMS.search, "");
        qParams2.set(BLOG_Q_PARAMS.page, "0");
        qParams2.set(BLOG_Q_PARAMS.genres, `${g2.id}`);
        return {
          id: g2.id,
          title: g2.name,
          description: g2.name,
          href: `/blog/search?${qParams2.toString()}`,
        };
      }),
    };
  });
}

export default function BlogNavMenu() {
  const [genre1s] = GenreDomain.useStore(useShallow((s) => [s.genre1s]));
  const t = useTranslations();
  const menuItems: Genre[] = fromGenreDomainToMenuItem(genre1s);

  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: string) => {
    const newPath = `/${locale}${pathname.substring(3)}`; // Change locale in the URL
    router.replace(newPath);
  };

  const supportLinks = [
    { name: "about_us", href: "/" },
    { name: "contact_us", href: "/" },
    { name: "Support", href: "/feedback" },
    {name: "news_and_tips", href: "/blog"}
  ];

  return (
    <div className="flex flex-col">
      <section className="flex justify-center items-center border-b border-border">
        <div className="flex flex-row space-x-4 italic flex-1">
          {supportLinks.map((value, index) => (
            <div className="flex flex-row items-center space-x-4" key={index}>
              <Link
                className="hover:underline hover:text-primary"
                key={index}
                href={value.href}
              >
                {t(value.name)}{" "}
              </Link>
              <Separator orientation="vertical" />
            </div>
          ))}
        </div>

        <div className="flex flex-row">
          <CommonSelect
            data={languages}
            defaultValue={languages[0]}
            onChange={(value) => {
              switchLanguage(value);
            }}
          />
          <div className="py-1">
            <Separator orientation="vertical" />
          </div>
        </div>
      </section>

      <div className="flex w-fit">
        <Link href="/">
          <Image src={"/logo.png"} alt="LOGO" width={150} height={150} />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href={"/blog"}
                className={navigationMenuTriggerStyle()}
              >
                {t("Home")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.children.length > 0 ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {item.children.map((subItem, subIndex) => (
                          <ListItem
                            title={subItem.title}
                            href={subItem.href ?? "/blog"}
                            key={subIndex}
                          ></ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href={item.href ?? ""}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <BlogSearchBar />
      </div>
    </div>
  );
}

function ListItem({
  title,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium p-2 hover:text-primary">
            {title}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
