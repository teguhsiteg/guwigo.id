"use client";

import { cn } from "@/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendText?: string;
  className?: string;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendText,
  className,
  iconBg = "bg-[#EFF6FF] text-[#2563EB]",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm",
        "hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
          {title}
        </p>
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
              iconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-serif text-[#0F172A]">{value}</p>
      {(subtitle || trendText) && (
        <div className="flex items-center gap-2 mt-2">
          {trendText && (
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-[#64748B]"
              )}
            >
              {trend === "up" && "↑"} {trend === "down" && "↓"} {trendText}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-[#94A3B8] font-normal">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
