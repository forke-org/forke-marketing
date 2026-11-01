import React from 'react'
import { cn } from "@/lib/utils";

/**
 * Radial background pattern component with Forke's signature orange accent (#FF7A00).
 */
export const Hero = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn("w-full relative h-screen", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#FF7A00_100%)] opacity-25"></div>
      </div>
      {children}
    </div>
  );
};

export const CardRadialBackground = ({
  className,
  opacity = 0.20,
}: {
  className?: string
  opacity?: number
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-0 [background:radial-gradient(125%_125%_at_50%_10%,#000000_40%,#FF7A00_100%)]",
        className
      )}
      style={{ opacity }}
    />
  );
};

export default Hero;
