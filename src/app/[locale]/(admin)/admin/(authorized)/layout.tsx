
import "@/styles/globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/sidebar/AppSideBar";
import AdminHeader from "@/components/sidebar/AdminBreadcrumb";
export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="flex-1 px-6 py-2">
        <AdminHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
