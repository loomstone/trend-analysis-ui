import React from "react";
import { cn } from "@/lib/utils";

interface LoaderOneProps {
  className?: string;
  color?: string;
}

export function LoaderOne({ className, color = "#3b82f6" }: LoaderOneProps) {
  return (
    <div className={cn("relative w-12 h-12", className)}>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .loader-ring {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <svg
        className="loader-ring"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.416 31.416"
          transform="rotate(-90 12 12)"
          opacity="0.25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="15.708 47.124"
          transform="rotate(-90 12 12)"
        />
      </svg>
    </div>
  );
}
