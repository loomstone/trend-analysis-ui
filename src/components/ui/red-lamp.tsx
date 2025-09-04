"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const RedLamp = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-0 -inset-x-8 -inset-y-4"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/15 to-transparent blur-xl" />
      </motion.div>





      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
