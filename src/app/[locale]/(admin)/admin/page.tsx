"use client";
import LoadingPage from "@/components/special/LoadingPage";
import { useRouter } from "@/i18n/navigation";



export default function AdminPage() {

  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoadingPage />
    </main>
  );
}
