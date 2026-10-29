import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-brand-400 bg-brand-500/10 border-brand-500/20",
  trend,
}) => {
  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-5 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between">
      {/* Decorative gradient blob */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-500/5 blur-2xl group-hover:bg-brand-500/10 transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10 gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
            {title}
          </p>
          <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
              {value}
            </span>
            {subtitle && (
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2 sm:p-3 rounded-xl border shrink-0 ${iconColor}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs relative z-10 flex-wrap">
          <span
            className={`font-semibold ${
              trend.isPositive !== false ? "text-brand-400" : "text-rose-400"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-500 text-[9px] sm:text-xs">so với tuần trước</span>
        </div>
      )}
    </div>
  );
};
