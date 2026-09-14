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
  iconBg = "bg-blue-50 text-blue-600",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm",
        "hover:shadow-md hover:border-slate-300 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
              iconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {(subtitle || trendText) && (
        <div className="flex items-center gap-2 mt-2">
          {trendText && (
            <span
              className={cn(
                "text-xs font-bold",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-slate-500"
              )}
            >
              {trend === "up" && "↑"} {trend === "down" && "↓"} {trendText}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
