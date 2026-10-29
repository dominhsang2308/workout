import React, { useState, useEffect } from "react";
import { Download, Share2, PlusSquare, X, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const PWAInstallPrompt: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if already installed & running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already running as an app
    }

    // 2. Check if user dismissed prompt recently
    const dismissedUntil = localStorage.getItem("fitbabe_pwa_dismissed");
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    const isSafari =
      /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);

    if (isIOSDevice) {
      setIsIOS(true);
      // Show iOS instruction after 2 seconds
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome / Desktop beforeinstallprompt handler
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 3 days
    localStorage.setItem(
      "fitbabe_pwa_dismissed",
      String(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c1229] via-[#1a0f26] to-[#120a1c] border border-brand-500/30 shadow-2xl shadow-brand-500/20 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{language === "vi" ? "Cài Đặt App FITBABE" : "Install FITBABE App"}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === "vi"
                  ? "Dùng toàn màn hình, mượt mà và không lo tải lại trang!"
                  : "Full-screen mobile experience, faster & zero browser bars!"}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content for iOS vs Android */}
        {isIOS ? (
          <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-brand-300 text-[11px] flex items-center gap-1">
              📱 {language === "vi" ? "Cách cài vào iPhone / iPad:" : "How to install on iOS:"}
            </p>
            <ol className="text-[11px] space-y-1 pl-4 list-decimal text-slate-300">
              <li>
                {language === "vi" ? (
                  <>
                    Bấm biểu tượng <strong>Chia sẻ</strong> (<Share2 className="w-3 h-3 inline text-brand-400" />) ở thanh dưới cùng của Safari.
                  </>
                ) : (
                  <>
                    Tap the <strong>Share</strong> button (<Share2 className="w-3 h-3 inline text-brand-400" />) at the bottom of Safari.
                  </>
                )}
              </li>
              <li>
                {language === "vi" ? (
                  <>
                    Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính"</strong> (<PlusSquare className="w-3 h-3 inline text-brand-400" />).
                  </>
                ) : (
                  <>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3 h-3 inline text-brand-400" />).
                  </>
                )}
              </li>
            </ol>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === "vi" ? "Cài Đặt Ngay (1 Chạm)" : "Install Now (1-Tap)"}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              {language === "vi" ? "Để sau" : "Later"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

