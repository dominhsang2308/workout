import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Heart,
  Clock,
  Trophy,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { statsService } from "../services/stats.service";
import { DashboardStats } from "../types";
import { StatCard } from "../components/StatCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { WorkoutCalendar } from "../components/WorkoutCalendar";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load dashboard statistics:", err);
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message={t("common.loading")} />;
  }

  const hours = stats ? Math.floor(stats.total_duration_minutes / 60) : 0;
  const mins = stats ? stats.total_duration_minutes % 60 : 0;
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ""}${mins}m`;

  const maxWeeklyVolume = Math.max(
    ...(stats?.weekly_progress.map((w) => w.total_volume_kg) || [1000]),
    1
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            {t("dashboard.heroGreeting")},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-accent">
              {user?.full_name || user?.username || (language === "vi" ? "Nàng Thơ" : "Beauty")}
            </span>
            ! 🌸
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {t("dashboard.heroSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3">
          <Link
            to="/active-workout"
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-95 text-center"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">{t("dashboard.quickStartBtn")}</span>
          </Link>
          <Link
            to="/plans"
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors text-center"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">{t("dashboard.viewPlansBtn")}</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        <StatCard
          title={t("dashboard.totalWorkouts")}
          value={stats?.total_workouts || 0}
          subtitle={t("dashboard.workoutsUnit")}
          icon={Heart}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
          trend={{
            value: `${stats?.workouts_this_week || 0} ${language === "vi" ? "tuần này" : "this week"}`,
            isPositive: (stats?.workouts_this_week || 0) >= (stats?.workouts_last_week || 0),
          }}
        />

        <StatCard
          title={t("dashboard.streak")}
          value={stats?.current_streak_days || 0}
          subtitle={t("dashboard.streakUnit")}
          icon={Flame}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
          trend={{
            value: `${language === "vi" ? "Kỷ lục:" : "Best:"} ${stats?.best_streak_days || 0} ${language === "vi" ? "ngày" : "days"} 🏆`,
            isPositive: true,
          }}
        />

        <StatCard
          title={t("dashboard.totalVolume")}
          value={
            stats?.total_volume_kg
              ? `${(stats.total_volume_kg / 1000).toFixed(1)}k`
              : "0"
          }
          subtitle="kg"
          icon={Trophy}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />

        <StatCard
          title={t("dashboard.totalTime")}
          value={timeFormatted}
          subtitle={t("dashboard.hoursUnit")}
          icon={Clock}
          iconColor="text-pink-400 bg-pink-500/10 border-pink-500/20"
        />
      </div>

      {/* Interactive Workout Calendar & Habit Heatmap */}
      <WorkoutCalendar
        dailyActivity={stats?.daily_activity}
        currentStreak={stats?.current_streak_days}
        bestStreak={stats?.best_streak_days}
      />

      {/* Analytics Charts & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progression Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                {t("dashboard.weeklyProgress")}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("dashboard.volumeLifted")}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
              6 {language === "vi" ? "Tuần" : "Weeks"}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          {stats?.weekly_progress && stats.weekly_progress.length > 0 ? (
            <div className="pt-4">
              <div className="h-44 flex items-end gap-3 sm:gap-6 justify-between px-2 border-b border-white/5 pb-2">
                {stats.weekly_progress.map((w, idx) => {
                  const heightPercent = Math.max(
                    Math.round((w.total_volume_kg / maxWeeklyVolume) * 100),
                    8
                  );
                  return (
                    <div
                      key={w.week_start}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      {/* Tooltip value */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-300 bg-dark-card px-2 py-0.5 rounded border border-white/10 pointer-events-none mb-1 shadow-md">
                        {w.total_volume_kg.toLocaleString()} kg
                      </div>

                      {/* Bar */}
                      <div className="w-full max-w-[48px] bg-dark-surface rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            idx === stats.weekly_progress.length - 1
                              ? "bg-gradient-to-t from-brand-600 to-brand-400 shadow-lg shadow-brand-500/20"
                              : "bg-gradient-to-t from-purple-800/60 to-purple-600/40 hover:from-purple-700/70 hover:to-purple-500/50"
                          }`}
                        />
                      </div>

                      {/* Label & Count */}
                      <div className="text-center mt-1">
                        <span className="text-[10px] font-semibold text-slate-400 block truncate max-w-[60px]">
                          {w.week_label.split(" ")[0]}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {w.workout_count} {language === "vi" ? "buổi" : "sessions"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              {t("dashboard.noWorkoutsYet")}
            </div>
          )}
        </div>

        {/* Muscle Group Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              {t("dashboard.muscleFocus")}
            </h3>
            <span className="text-xs text-slate-400">{t("common.all")}</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            {language === "vi" ? "Phân bổ số hiệp theo nhóm cơ" : "Set distribution by muscle group"}
          </p>

          {stats?.muscle_group_distribution &&
          stats.muscle_group_distribution.length > 0 ? (
            <div className="space-y-3.5">
              {stats.muscle_group_distribution.slice(0, 6).map((item) => (
                <div key={item.muscle_group} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">
                      {t(`muscle.${item.muscle_group}`, item.muscle_group)}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {item.sets_count} {language === "vi" ? "hiệp" : "sets"} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-surface overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-accent transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              {t("dashboard.noWorkoutsDesc")} ✨
            </div>
          )}
        </div>
      </div>

      {/* Recent Workouts Activity */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-400" />
              {t("dashboard.recentSessions")}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === "vi" ? "Các buổi tập đã hoàn thành gần đây" : "Recently completed training sessions"}
            </p>
          </div>
          <Link
            to="/history"
            className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>{t("dashboard.viewAllHistory")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_workouts && stats.recent_workouts.length > 0 ? (
          <div className="divide-y divide-white/5">
            {stats.recent_workouts.map((session) => {
              const durMins = Math.round(session.duration_seconds / 60);
              const dateStr = new Date(session.started_at).toLocaleDateString(
                language === "vi" ? "vi-VN" : "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              );

              return (
                <div
                  key={session.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500/10 to-brand-accent/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{durMins} {language === "vi" ? "phút" : "mins"}</span>
                        <span>•</span>
                        <span>{session.sets.length} {language === "vi" ? "hiệp hoàn thành" : "sets done"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">{t("dashboard.totalVolume")}</span>
                      <span className="text-sm font-bold text-brand-400 font-heading">
                        {session.total_volume_kg.toLocaleString()} kg
                      </span>
                    </div>

                    <Link
                      to={`/history`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title={t("dashboard.noWorkoutsYet")}
            description={t("dashboard.noWorkoutsDesc")}
            actionText={t("dashboard.startFirstWorkout")}
            onAction={() => (window.location.href = "/active-workout")}
          />
        )}
      </div>
    </div>
  );
};
