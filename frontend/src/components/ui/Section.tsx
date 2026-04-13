import * as React from "react";
import { cn } from "../../lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  dark?: boolean;
}

export function Section({ children, className, dark = false, ...props }: SectionProps) {
  return (
    <section 
      className={cn(
        "py-20 md:py-28", 
        dark ? "bg-slate-950" : "bg-slate-900", 
        className
      )} 
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
