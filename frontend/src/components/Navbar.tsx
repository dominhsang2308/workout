import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0f0a15]/95 backdrop-blur-md safe-top">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight font-heading text-white">
              FIT<span className="text-brand-400">BABE</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-medium border border-brand-500/20">
              {t("nav.brandSub")}
            </span>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <Link
                to="/active-workout"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-brand-500/25 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t("nav.startWorkout")}</span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 sm:border-l sm:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500/20 to-brand-accent/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                    {user?.username ? user.username.slice(0, 2).toUpperCase() : "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title={t("nav.logout")}
                  className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white transition-colors shadow-md shadow-brand-500/20"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
