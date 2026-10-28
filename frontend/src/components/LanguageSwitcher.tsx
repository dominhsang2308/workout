import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  if (compact) {
    return (
      <button
        onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
        title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
      >
        <Globe className="w-3.5 h-3.5 text-brand-400" />
        <span className="uppercase font-bold tracking-wider text-brand-300">
          {language === "vi" ? "VI 🇻🇳" : "EN 🇬🇧"}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
          language === "vi"
            ? "bg-gradient-to-r from-brand-500 to-brand-accent text-white shadow-sm shadow-brand-500/30 scale-100"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-brand-500 to-brand-accent text-white shadow-sm shadow-brand-500/30 scale-100"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
