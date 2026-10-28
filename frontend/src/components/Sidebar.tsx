import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlayCircle,
  History,
  Sparkles,
  Utensils,
  Heart,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.dashboard"), path: "/", icon: LayoutDashboard },
    { name: t("nav.plans"), path: "/plans", icon: CalendarDays },
    { name: t("nav.activeWorkout"), path: "/active-workout", icon: PlayCircle },
    { name: t("nav.history"), path: "/history", icon: History },
    { name: t("nav.exercises"), path: "/exercises", icon: Sparkles },
    { name: t("nav.nutrition"), path: "/nutrition", icon: Utensils },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0f0a15]/50 p-4 space-y-6 shrink-0">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("nav.sectionTitle")}
          </p>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-950/40 to-purple-900/30 border border-brand-500/15">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
              <Heart className="w-3.5 h-3.5 fill-brand-400 animate-pulse" />
              {t("nav.healthTipTitle")}
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {t("nav.healthTipDesc")}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0a15]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-brand-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
