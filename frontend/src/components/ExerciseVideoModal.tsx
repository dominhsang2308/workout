import React from "react";
import { Sparkles, ExternalLink, X, CheckCircle2, Video, Clock, Award, Play } from "lucide-react";
import { Exercise } from "../types";
import { getExerciseVideo } from "../utils/exerciseVideos";
import { getLocalizedExercise } from "../i18n/exerciseTranslations";
import { useLanguage } from "../context/LanguageContext";

interface ExerciseVideoModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const { t, language } = useLanguage();

  if (!isOpen || !exercise) return null;

  const localized = getLocalizedExercise(exercise, language);
  const videoInfo = getExerciseVideo(exercise);
  const isDirectMp4 = videoInfo.embedUrl.endsWith(".mp4") || videoInfo.embedUrl.endsWith(".webm");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#140d1f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0f0a15]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-accent flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading truncate max-w-sm sm:max-w-md">
                  {localized.name}
                </h3>
                {/* 20-30s badge */}
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Clock className="w-3 h-3 text-rose-400" />
                  {videoInfo.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="text-brand-400 font-medium">
                  {t(`muscle.${exercise.muscle_group}`, exercise.muscle_group)}
                </span>
                <span>•</span>
                <span>{localized.equipment}</span>
                <span>•</span>
                <span className="text-amber-300/90 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  {videoInfo.channel}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black/95 flex items-center justify-center overflow-hidden">
          {isDirectMp4 ? (
            <video
              src={videoInfo.embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={videoInfo.embedUrl}
              title={`${exercise.name} 20-30s Technique Demonstration`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Focus Banner with direct YouTube link option */}
        <div className="bg-rose-950/30 px-6 py-2.5 border-b border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <span>
              {language === "vi"
                ? "⚡ Video ngắn 20-30s tập trung trực tiếp vào động tác chuẩn, không lan man, không quảng cáo."
                : "⚡ Direct 20-30s demo focused strictly on proper form cues, no intro or fluff."}
            </span>
          </div>

          <a
            href={videoInfo.directWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-2 shrink-0 self-start sm:self-auto"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{language === "vi" ? "Mở trực tiếp trên YouTube" : "Open in YouTube"} ↗</span>
          </a>
        </div>

        {/* Content & Technique Checklist */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Form Cues Checklist */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>
                {language === "vi" ? "Lưu Ý Kỹ Thuật Động Tác Chuẩn" : "Key Form & Execution Cues"}
              </span>
            </h4>

            <ul className="space-y-2">
              {videoInfo.keyPoints[language === "vi" ? "vi" : "en"].map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description & Steps if available */}
          {(localized.description || localized.instructions) && (
            <div className="space-y-2 text-xs">
              {localized.description && (
                <p className="text-slate-300 leading-relaxed">
                  {localized.description}
                </p>
              )}
              {localized.instructions && (
                <div className="p-3.5 rounded-xl bg-dark-surface/60 border border-white/5 text-slate-300 whitespace-pre-line leading-relaxed">
                  {localized.instructions}
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <a
              href={videoInfo.youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>
                {language === "vi" ? "Tìm thêm bài phân tích trên YouTube" : "Search more on YouTube"}
              </span>
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all"
            >
              {language === "vi" ? "Đã Hiểu & Đóng" : "Got it & Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
