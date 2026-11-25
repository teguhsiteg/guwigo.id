"use client";

import { cn } from "@/utils";

type BadgeVariant = "default" | "brand" | "cyan" | "success" | "warning" | "error" | "info" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]",
  brand: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
  cyan: "bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC]",
  success: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
  warning: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
  error: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
  info: "bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]",
  purple: "bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF]",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-[#64748B]",
  brand: "bg-[#2563EB]",
  cyan: "bg-[#06B6D4]",
  success: "bg-[#10B981]",
  warning: "bg-[#F59E0B]",
  error: "bg-[#EF4444]",
  info: "bg-[#0284C7]",
  purple: "bg-[#A855F7]",
};

export default function Badge({
  children,
  variant = "default",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-tight select-none",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}
