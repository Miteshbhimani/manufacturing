import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-wide transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-sm",
          {
            "bg-[#0b3d91] text-white hover:bg-blue-900 border border-transparent shadow-sm": variant === 'primary',
            "bg-[#d32f2f] text-white hover:bg-red-800 border border-transparent shadow-sm": variant === 'secondary',
            "border-2 border-[#0b3d91] bg-transparent hover:bg-blue-50 text-[#0b3d91]": variant === 'outline',
            "hover:bg-slate-100 text-slate-700": variant === 'ghost',
            "h-10 px-6 text-sm": size === 'md',
            "h-8 px-4 text-xs": size === 'sm',
            "h-12 px-8 text-base": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
