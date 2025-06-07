import React from "react";
import { cn } from "@/lib/utils"; // optional, or just use clsx or plain className merging

interface ThreeDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function ThreeDButton({ children, className, ...props }: ThreeDButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 font-semibold text-white bg-blue-600 border-b-4 border-blue-800 rounded-lg shadow-md active:translate-y-1 active:border-b-2 transition-all duration-150 hover:opacity-90",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
