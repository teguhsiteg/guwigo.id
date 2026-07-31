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
  const colorClasses: Record<string, string> = {
    blue: "from-blue-50 to-blue-50 border-blue-200",
    green: "from-green-50 to-green-50 border-green-200",
    red: "from-red-50 to-red-50 border-red-200",
    yellow: "from-yellow-50 to-yellow-50 border-yellow-200",
    purple: "from-purple-50 to-purple-50 border-purple-200",
    indigo: "from-indigo-50 to-indigo-50 border-indigo-200",
  };

  const iconClasses: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-6 transition-all cursor-pointer ${
        onClick ? "hover:shadow-lg hover:shadow-blue-500/10" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-gray-900 text-2xl font-bold">{value}</p>
            {unit && <span className="text-gray-600 text-sm">{unit}</span>}
          </div>
          {trend && (
            <div
              className={`mt-2 text-xs font-medium ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
            </div>
          )}
        </div>
        <div className={`${iconClasses[color]} opacity-50`}>{icon}</div>
      </div>
    </div>
  );
}
