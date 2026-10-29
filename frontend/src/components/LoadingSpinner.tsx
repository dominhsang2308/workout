import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Đang tải...",
  fullScreen = false,
}) => {
  const [showColdStartHint, setShowColdStartHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowColdStartHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-brand-400">
          <Heart className="w-5 h-5 animate-pulse fill-brand-400" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300">{message}</p>
      {showColdStartHint && (
        <p className="text-xs text-amber-300/80 max-w-xs animate-in fade-in duration-500 leading-relaxed bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
          ☁️ Máy chủ đám mây đang thức dậy sau thời gian nghỉ, bạn đợi vài giây nhé...
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
