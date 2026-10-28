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
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-500/5 blur-2xl group-hover:bg-brand-500/10 transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs font-medium text-slate-400">{subtitle}</span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs relative z-10">
          <span
            className={`font-semibold ${
              trend.isPositive !== false ? "text-brand-400" : "text-rose-400"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-500">so với tuần trước</span>
        </div>
      )}
    </div>
  );
};
