import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Trash2,
  ChevronRight,
  Plus,
  Heart,
} from "lucide-react";
import { sessionService } from "../services/session.service";
import { WorkoutSession } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";

export const WorkoutHistory: React.FC = () => {
  const { t, language } = useLanguage();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(
    null
  );

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load workout history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t("history.deleteConfirm"))) {
      return;
    }
    try {
      await sessionService.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    } catch (err) {
      alert(t("common.error"));
    }
  };

  // Group sets by exercise for clean presentation in detail modal
  const groupedSets = React.useMemo(() => {
    if (!selectedSession) return [];
    const map = new Map<number, { name: string; sets: any[] }>();
    selectedSession.sets.forEach((s) => {
      const exName = s.exercise?.name || `Exercise #${s.exercise_id}`;
      if (!map.has(s.exercise_id)) {
        map.set(s.exercise_id, { name: exName, sets: [] });
      }
      map.get(s.exercise_id)!.sets.push(s);
    });
    return Array.from(map.values());
  }, [selectedSession]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            🌸 {t("history.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("history.subtitle")}
          </p>
        </div>

        <Link
          to="/active-workout"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{t("nav.startWorkout")}</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message={t("common.loading")} />
      ) : sessions.length > 0 ? (
        <div className="space-y-3.5">
          {sessions.map((session) => {
            const dateStr = new Date(session.started_at).toLocaleDateString(
              language === "vi" ? "vi-VN" : "en-US",
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );
            const durMins = Math.round(session.duration_seconds / 60);

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="glass-card rounded-2xl p-5 cursor-pointer hover:border-brand-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 fill-brand-400" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {durMins} {language === "vi" ? "phút" : "min"}
                      </span>
                      <span>•</span>
                      <span>{session.sets.length} {language === "vi" ? "hiệp" : "sets"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pl-16 sm:pl-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {t("history.volume")}
                    </span>
                    <span className="text-base font-extrabold text-brand-400 font-heading">
                      {session.total_volume_kg.toLocaleString()} kg
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      title={t("common.delete")}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-slate-400 group-hover:text-brand-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title={t("history.noHistory")}
          description={t("history.noHistoryDesc")}
          actionText={t("dashboard.startFirstWorkout")}
          onAction={() => (window.location.href = "/active-workout")}
        />
      )}

      {/* Session Detail Modal */}
      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={selectedSession?.title || (language === "vi" ? "Chi Tiết Buổi Tập" : "Workout Summary")}
        maxWidth="max-w-2xl"
      >
        {selectedSession && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-dark-surface border border-white/5 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {language === "vi" ? "Ngày tập" : "Date"}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {new Date(selectedSession.started_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t("history.duration")}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {Math.round(selectedSession.duration_seconds / 60)} {language === "vi" ? "phút" : "min"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t("history.volume")}
                </span>
                <span className="text-xs sm:text-sm font-bold text-brand-400">
                  {selectedSession.total_volume_kg.toLocaleString()} kg
                </span>
              </div>
            </div>

            {selectedSession.notes && (
              <div className="p-3.5 rounded-xl bg-dark-surface/60 border border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t("history.notes")}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 italic">
                  "{selectedSession.notes}"
                </p>
              </div>
            )}

            {/* Exercise Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("history.details")}
              </h4>

              {groupedSets.map((grp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-dark-surface/50 border border-white/5 space-y-2"
                >
                  <h5 className="text-sm font-bold text-white">{grp.name}</h5>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 text-[10px] uppercase border-b border-white/5">
                          <th className="py-1.5 px-2">{t("active.set")}</th>
                          <th className="py-1.5 px-2">{t("active.weight")}</th>
                          <th className="py-1.5 px-2">{t("active.reps")}</th>
                          <th className="py-1.5 px-2 text-center">{t("active.rpe")}</th>
                          <th className="py-1.5 px-2 text-right">{t("active.volume")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {grp.sets.map((s, sIdx) => (
                          <tr key={sIdx}>
                            <td className="py-1.5 px-2 font-bold text-slate-300">
                              #{s.set_number}
                            </td>
                            <td className="py-1.5 px-2 text-slate-200">
                              {s.weight_kg} kg
                            </td>
                            <td className="py-1.5 px-2 text-slate-200">
                              {s.reps}
                            </td>
                            <td className="py-1.5 px-2 text-center text-slate-400">
                              {s.rpe ? `${s.rpe}` : "-"}
                            </td>
                            <td className="py-1.5 px-2 text-right font-medium text-brand-400">
                              {(s.weight_kg * s.reps).toLocaleString()} kg
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
