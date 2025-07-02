import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import PermissionVerification from "@/components/auth/PermissionVerification";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Trang quản lý của hệ thống bán lẻ phần mềm Phoenix",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  }
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  
  return (
    <html lang={locale}>
      <body className={`${roboto.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <PermissionVerification />
          <Toaster
            richColors
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
