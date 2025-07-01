
import React from 'react'
import * as Sentry from "@sentry/nextjs";

export default function page() {


    const handleThrowError = () => {
          try {
            throw new Error("This is a test error");
          } catch (error) {
            Sentry.captureException(error, {
                  tags: {
                    type: "global-error",
                  },
                });
            console.error("Error captured by Sentry:", error);
          }
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sentry Test Page</h1>
      <button
        onClick={handleThrowError}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Throw Error
      </button>
    </div>
  )
}
