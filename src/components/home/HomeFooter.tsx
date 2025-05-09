import { useTranslations } from "next-intl";
import React from "react";
import { supportPhone } from "@/lib/constants";
import Link from "next/link";
import Logo from "@/components/common/Logo";

export default function HomeFooter() {
  const t = useTranslations();

  const footerLinks = [
    {
      title: "Introduction",
      links: [
        { name: "what_copyright_software", href: "/" },
        { name: "introduce_shop", href: "/" },
        { name: "service_policy", href: "/" },
        { name: "privacy_policy", href: "/" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Login", href: "/" },
        { name: "Register", href: "/" },
      ],
    },
  ];

  return (
    <footer >
      <div className="grid grid-cols-3 my-10 main-container">
      {
        footerLinks.map((section, index) => (
          <div className="flex flex-col h-full gap-1" key={index}>
            <h4 >{t(section.title)}</h4>
            {section.links.map((link, index) => (
              <Link
                key={index}
                className="hover:text-primary hover:underline hover:underline-offset-3"
                href={link.href}
              >
                {t(link.name)}
              </Link>
            ))}
          </div>
        ))
      }
      <div className="flex flex-col h-full gap-1">
        <h4 className="bold">{t("Contact")}</h4>
        <span className="italic">{t("auto_hotline")}</span>
        <span className="italic">
          {t("call_us")} <span className="font-bold">{supportPhone}</span>
        </span>
        <Logo />
      </div>


      
      </div>
    </footer>
  );
}
