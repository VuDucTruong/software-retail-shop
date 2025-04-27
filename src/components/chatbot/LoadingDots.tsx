"use client";

import { motion } from "framer-motion";

export function LoadingDots() {

  const loadingPoints = [0, -5, 0]

  return (
    <div className="flex gap-1">
      <motion.span
        className="size-2 bg-primary rounded-full"
        animate={{ y: loadingPoints }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 0.8, delay: 0 }}
      />
      <motion.span
        className="size-2 bg-primary rounded-full"
        animate={{ y: loadingPoints }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 0.8, delay: 0.2 }}
      />
      <motion.span
        className="size-2 bg-primary rounded-full"
        animate={{ y: loadingPoints }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 0.8, delay: 0.4 }}
      />
    </div>
  );
}
