"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen bg-background text-foreground transition-all",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Aurora background using Tailwind custom utilities */}
        <div
          className={cn(
            // Base layout and effects
            "absolute -inset-[10px] opacity-40 will-change-transform pointer-events-none",
            // Aurora gradients and styling
            "aurora-gradients aurora-base dark:aurora-dark aurora-after dark:aurora-after-dark",
            // Optional mask
            showRadialGradient && "aurora-mask"
          )}
        ></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};