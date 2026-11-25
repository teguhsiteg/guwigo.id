"use client";

import { cn } from "@/utils";

type CardVariant = "default" | "glass" | "subtle" | "elevated";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-[#E2E8F0] shadow-sm",
  glass: "claude-glass border border-[#E2E8F0] shadow-sm",
  subtle: "bg-[#F1F5F9] border border-[#E2E8F0]",
  elevated: "bg-white border border-[#E2E8F0] shadow-md",
};

export default function Card({
  children,
  className,
  hover = false,
  padding = "md",
  variant = "default",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200 ease-out",
        variantStyles[variant],
        paddings[padding],
        hover && "hover:-translate-y-0.5 hover:shadow-md hover:border-[#CBD5E1]",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Card Header ─── */
export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-6", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 bg-[#2563EB]/10 text-[#2563EB] rounded-md flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base sm:text-lg font-serif font-normal text-[#0F172A] tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-xs text-[#64748B] font-normal mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
