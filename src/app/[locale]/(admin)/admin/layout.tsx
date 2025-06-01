import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trang quản lý",
  description: "Trang quản lý của hệ thống bán lẻ phần mềm Phoenix",
  
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  
  return (
    <html lang={locale}>
      <body className={`${roboto.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Toaster
            richColors
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
