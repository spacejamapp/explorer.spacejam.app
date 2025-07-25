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
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.03)_7%,transparent_10%,transparent_12%,rgba(255,255,255,0.03)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.03)_7%,transparent_10%,transparent_12%,rgba(0,0,0,0.03)_16%)]
            [--aurora:repeating-linear-gradient(100deg,rgba(236,72,153,0.3)_10%,rgba(168,85,247,0.3)_15%,rgba(34,211,238,0.3)_20%,rgba(168,85,247,0.2)_25%,rgba(236,72,153,0.3)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-40 will-change-transform`,

            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_center_top,black_10%,transparent_70%)]`
          )}
        ></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};