import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "@/styles/globals.css";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {Locale, routing} from "@/i18n/routing";
import {Toaster} from "sonner";
import BlogNavMenu from "@/components/blog/BlogNavMenu";
import Image from "next/image";
import Link from "next/link";
import {InitBlogStore} from "@/components/store_cleaners/InitBlogStore";
import {InitGenreStore} from "@/components/store_cleaners/ResetBlogStore";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Phoenix Shop Blogs",
    description: "Phoenix Shop Blogs",
};

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const {locale} = await params;
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
            <header className="shadow-md">
                <div className="main-container">
                    <InitGenreStore/>
                    <InitBlogStore/>
                    <Link href="/"><Image src={"/logo.png"} alt="LOGO" width={150} height={150}/></Link>
                    <BlogNavMenu/>
                </div>
            </header>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
