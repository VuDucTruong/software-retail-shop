import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import HomeHeader from "@/components/home/HomeHeader";
import ChatButton from "@/components/chatbot/ChatButton";
import { Toaster } from "sonner";
import HomeFooter from "@/components/home/HomeFooter";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});


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
            <main>
              {children}
            </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}