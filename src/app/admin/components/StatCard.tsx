"use client";

import type { StatCard as StatCardType } from "./types";

interface StatCardProps extends StatCardType {
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  color,
  unit,
  trend,
  onClick,
}: StatCardProps) {
  const colorBgMap: Record<string, string> = {
    blue: "bg-[#0071E3]/10 text-[#0071E3]",
    green: "bg-[#34C759]/10 text-[#248A3D]",
    red: "bg-[#FF3B30]/10 text-[#D70015]",
    yellow: "bg-[#FF9500]/10 text-[#C96B00]",
    purple: "bg-[#AF52DE]/10 text-[#8944AB]",
    indigo: "bg-[#5856D6]/10 text-[#5856D6]",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-2xl p-5 shadow-apple-sm transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-apple-md hover:border-black/[0.12] active:scale-[0.98]"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#86868B] tracking-tight">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <p className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{value}</p>
            {unit && <span className="text-xs font-medium text-[#86868B]">{unit}</span>}
          </div>
          {trend && (
            <div
              className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                trend.direction === "up"
                  ? "bg-[#34C759]/10 text-[#248A3D]"
                  : "bg-[#FF3B30]/10 text-[#D70015]"
              }`}
            >
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            colorBgMap[color] || "bg-[#0071E3]/10 text-[#0071E3]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
