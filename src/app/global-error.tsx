"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import "@/styles/globals.css";
import UnexptectedError from "@/components/special/UnexpectedError";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {

  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        type: "global-error",
      },
    });
  }, [error]);


  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen">
        <UnexptectedError />
      </body>
    </html>
  );
}
