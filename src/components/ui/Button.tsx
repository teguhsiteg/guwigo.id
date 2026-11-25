"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "glass"
  | "dark";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  pill?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/20 border border-[#2563EB]/30 focus-visible:ring-[#2563EB]",
  dark:
    "bg-[#0A0F1D] hover:bg-[#131C31] text-white shadow-sm border border-[#1E293B] focus-visible:ring-[#2563EB]",
  secondary:
    "bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] border border-[#BFDBFE] focus-visible:ring-[#2563EB]",
  outline:
    "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#FAF9F6] hover:border-[#CBD5E1] shadow-sm focus-visible:ring-[#2563EB]",
  ghost:
    "bg-transparent text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:ring-[#2563EB]",
  glass:
    "claude-glass text-[#0F172A] hover:bg-white border border-[#E2E8F0] shadow-sm focus-visible:ring-[#2563EB]",
  danger:
    "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm focus-visible:ring-red-500",
  success:
    "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm focus-visible:ring-emerald-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-[11px] font-medium gap-1 min-h-[26px]",
  sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5 min-h-[32px]",
  md: "px-4.5 py-2.5 text-sm font-medium gap-2 min-h-[40px]",
  lg: "px-6 py-3.5 text-base font-medium gap-2.5 min-h-[46px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      pill = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center tracking-tight transition-all duration-150 ease-out select-none",
          "active:scale-[0.98] apple-press",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100",
          pill ? "rounded-lg" : "rounded-lg",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={size === "xs" || size === "sm" ? 14 : 16} className="animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
