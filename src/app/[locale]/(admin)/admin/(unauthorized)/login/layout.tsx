
import "@/styles/globals.css";


export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="h-screen flex flex-col items-center justify-center">
        {children}
      </main>
  );
}