import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4 py-2.2 rounded-xl gap-2",
      lg: "text-base px-6 py-3 rounded-xl gap-2.5",
      icon: "w-9 h-9 rounded-xl p-0",
    };

    const variantStyles = {
      primary:
        "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 border border-violet-500/30",
      secondary:
        "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60 shadow-sm",
      outline:
        "bg-transparent hover:bg-white/5 text-neutral-200 border border-neutral-700 hover:border-neutral-500",
      ghost: "bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20",
      gradient:
        "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-violet-600/25 border border-white/20",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
