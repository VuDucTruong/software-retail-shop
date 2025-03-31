"use client";

import Link from "next/link";
import React from "react";
import {
  currencies,
  languages,
  shopName,
  supportPhone,
} from "@/config/constants";
import {
  FaEye,
  FaFireAlt,
  FaPercent,
} from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CommonSelect } from "../CommonSelect";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AuthDialog } from "../dialog/AuthDialog";
import Logo from "../Logo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import { Separator } from "@/components/ui/separator";

export default function HomeHeader() {
  const t = useTranslations();
  const translatedLanguages = languages.map((value, _) => t(value));

  const productLinks = [
    { name: "popular_products", icon: FaFireAlt, href: "/" },
    { name: "promotional_products", icon: RiDiscountPercentLine , href: "/" },
    { name: "recently_viewed", icon: FaEye, href: "/" },
  ];

  const supportLinks = [
    { name: "about_us", href: "/" },
    { name: "contact_us", href: "/" },
    { name: "FAQS", href: "/faq" },
  ];

  return (
    <header>
      <div className="flex flex-col justify-center">
        {/* Info Section */}
        <section className="flex justify-center items-center main-container ">
          <div className="flex flex-row space-x-4 italic flex-1">
            {supportLinks.map((value, index) => (
              <div className="flex flex-row items-center space-x-4" key={index}>
                <Link className="hover:underline hover:text-primary" key={index} href={value.href}>
                  {t(value.name)}{" "}
                </Link>
                <Separator orientation="vertical" />
              </div>
            ))}
          </div>
          
          <div className="flex flex-row">
            <CommonSelect
              data={translatedLanguages}
              defaultValue={translatedLanguages[0]}
            />
            <div className="py-1">
              <Separator orientation="vertical" />
            </div>
            <CommonSelect data={currencies} defaultValue={currencies[0]} />
          </div>
        </section>
        <Separator />
        {/* Search Section */}
        <section className="flex flex-row justify-between items-center main-container">
          <Logo />
          <SearchBar />
          <div className="flex space-x-2 items-center">
            <AuthDialog />
            <div className="h-7">
              <Separator orientation="vertical" />
            </div>
            <CartButton />
          </div>
        </section>
        <Separator/>
        {/* Popular Links */}
        <section className="flex flex-row items-center justify-start space-x-1 main-container">
          {productLinks.map((value, index) => (
              <Link
                key={index}
                className="flex flex-row text-muted-foreground hover:font-medium gap-4 items-center px-2 border-r-2 border-border hover:underline hover:text-primary"
                href={value.href}
              >
                <value.icon className="size-5 text-primary" /> {t(value.name)}
              </Link>
          ))}
        </section>
        <Separator/>
      </div>
    </header>
  );
}
