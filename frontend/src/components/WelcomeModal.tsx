import React, { useState, useEffect } from "react";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Modal } from "./Modal";

export const WelcomeModal: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    const onboarded = localStorage.getItem("fitbabe_onboarded");
    if (!onboarded) {
      // Trigger welcome for new users after 600ms
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inputName.trim() || (language === "vi" ? "Nàng Thơ" : "Beauty");
    updateProfile({
      full_name: finalName,
      username: finalName.toLowerCase().replace(/[^a-z0-9]/gi, "") || "fitbabe",
    });
    localStorage.setItem("fitbabe_onboarded", "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("fitbabe_onboarded", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title={language === "vi" ? "🌸 Chào Mừng" : "🌸 Welcome"}>
      <div className="text-center space-y-5 py-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
          <Heart className="w-7 h-7 fill-white animate-pulse" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
            🌸 {language === "vi" ? "Chào Mừng Đến Với FITBABE!" : "Welcome to FITBABE!"}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            {language === "vi"
              ? "Ứng dụng rèn luyện vóc dáng săn chắc, tự tin và tràn đầy năng lượng dành riêng cho phái đẹp."
              : "Sculpt your body, boost your confidence, and feel amazing every day."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 max-w-xs mx-auto">
          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 text-center">
              {language === "vi" ? "Bạn tên là gì để FITBABE xưng hô nhé?" : "What's your name / nickname?"}
            </label>
            <input
              type="text"
              autoFocus
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={language === "vi" ? "Ví dụ: Hoa, Linh, Gabriel..." : "e.g., Sarah, Emma..."}
              className="w-full px-4 py-2.5 bg-dark-surface border border-brand-500/40 rounded-xl text-white text-center text-sm placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 via-pink-600 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{language === "vi" ? "Bắt Đầu Luyện Tập" : "Start My Journey"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 block w-full text-center"
            >
              {language === "vi" ? "Để sau (Dùng tên mặc định)" : "Skip for now"}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 pt-1 border-t border-white/5">
          🔒 {language === "vi" ? "Dữ liệu lưu 100% riêng tư trên thiết bị của bạn." : "100% private & stored directly on your device."}
        </p>
      </div>
    </Modal>
  );
};
