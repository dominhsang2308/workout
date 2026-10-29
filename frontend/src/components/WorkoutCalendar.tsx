import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Dumbbell,
  Sparkles,
  Trophy,
  Layers,
  X,
  Info,
} from "lucide-react";
import { DailyActivityItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface WorkoutCalendarProps {
  dailyActivity?: DailyActivityItem[];
  currentStreak?: number;
  bestStreak?: number;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  dailyActivity = [],
  currentStreak = 0,
  bestStreak = 0,
}) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<"calendar" | "heatmap">("calendar");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayItem, setSelectedDayItem] = useState<{
    dateStr: string;
    activity?: DailyActivityItem;
  } | null>(null);

  // Activity map by date string "YYYY-MM-DD"
  const activityMap = useMemo(() => {
    const map = new Map<string, DailyActivityItem>();
    dailyActivity.forEach((item) => {
      // Normalize to YYYY-MM-DD
      const d = item.date.slice(0, 10);
      map.set(d, item);
    });
    return map;
  }, [dailyActivity]);

  // Current year & month for calendar view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Calendar Grid Computation
  const { calendarDays, monthTotalWorkouts, monthTotalMinutes, monthTotalVolume } =
    useMemo(() => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
      // Convert Sunday (0) to index 6, Monday (1) to index 0
      const startOffset = (firstDayOfWeek + 6) % 7;

      const days: Array<{
        date: Date;
        dayNum: number;
        dateStr: string;
        isCurrentMonth: boolean;
        isToday: boolean;
        activity?: DailyActivityItem;
      }> = [];

      // Leading days from previous month
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      for (let i = startOffset - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, daysInPrevMonth - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${day}`;
        days.push({
          date: d,
          dayNum: daysInPrevMonth - i,
          dateStr,
          isCurrentMonth: false,
          isToday: false,
          activity: activityMap.get(dateStr),
        });
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      let mWorkouts = 0;
      let mMins = 0;
      let mVol = 0;

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dayFormatted = String(day).padStart(2, "0");
        const dateStr = `${y}-${m}-${dayFormatted}`;
        const act = activityMap.get(dateStr);

        if (act) {
          mWorkouts += act.workout_count;
          mMins += act.duration_minutes;
          mVol += act.total_volume_kg;
        }

        days.push({
          date: d,
          dayNum: day,
          dateStr,
          isCurrentMonth: true,
          isToday: dateStr === todayStr,
          activity: act,
        });
      }

      // Trailing days from next month to fill grid (42 cells = 6 rows x 7 cols)
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dayFormatted = String(i).padStart(2, "0");
        const dateStr = `${y}-${m}-${dayFormatted}`;
        days.push({
          date: d,
          dayNum: i,
          dateStr,
          isCurrentMonth: false,
          isToday: false,
          activity: activityMap.get(dateStr),
        });
      }

      return {
        calendarDays: days,
        monthTotalWorkouts: mWorkouts,
        monthTotalMinutes: mMins,
        monthTotalVolume: mVol,
      };
    }, [year, month, activityMap]);

  // Heatmap: Last 16 weeks (112 days)
  const heatmapData = useMemo(() => {
    const today = new Date();
    // Start from today and go back 15 weeks (16 weeks total)
    const weeksCount = 16;
    const todayDayOfWeek = (today.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const totalDays = weeksCount * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - todayDayOfWeek - (weeksCount - 1) * 7);

    const weeks: Array<
      Array<{
        dateStr: string;
        dayNum: number;
        activity?: DailyActivityItem;
        isToday: boolean;
        level: number; // 0, 1, 2, 3
      }>
    > = [];

    const todayStr = today.toISOString().slice(0, 10);

    for (let w = 0; w < weeksCount; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(startDate);
        cur.setDate(startDate.getDate() + w * 7 + d);
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, "0");
        const dayFormatted = String(cur.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${dayFormatted}`;
        const act = activityMap.get(dateStr);

        let level = 0;
        if (act && act.workout_count > 0) {
          if (act.duration_minutes >= 60 || act.workout_count >= 2) {
            level = 3;
          } else if (act.duration_minutes >= 30) {
            level = 2;
          } else {
            level = 1;
          }
        }

        weekDays.push({
          dateStr,
          dayNum: cur.getDate(),
          activity: act,
          isToday: dateStr === todayStr,
          level,
        });
      }
      weeks.push(weekDays);
    }

    return weeks;
  }, [activityMap]);

  const monthNamesVi = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthLabel =
    language === "vi"
      ? `${monthNamesVi[month]} năm ${year}`
      : `${monthNamesEn[month]} ${year}`;

  const weekDayHeaders =
    language === "vi"
      ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-6 space-y-5 sm:space-y-6 relative overflow-hidden border border-brand-500/20 shadow-xl">
      {/* Header bar: Title, Streak Badges & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 border-b border-white/5 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              <span>{language === "vi" ? "Lịch Tập & Điểm Danh" : "Workout Calendar & Habit Streak"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {language === "vi"
                ? "Theo dõi kỷ luật và chuỗi ngày rèn luyện vóc dáng của bạn"
                : "Track workout consistency and build an unbreakable fitness habit"}
            </p>
          </div>
        </div>

        {/* Streak & View Mode Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap w-full sm:w-auto">
          {/* Current Streak Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-500/30 text-amber-300 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
                {language === "vi" ? "Chuỗi Hiện Tại" : "Streak"}
              </span>
              <span className="text-xs font-black text-amber-300 font-heading">
                {currentStreak} {language === "vi" ? "ngày" : "days"}
              </span>
            </div>
          </div>

          {/* Best Streak Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
                {language === "vi" ? "Kỷ Lục" : "Best"}
              </span>
              <span className="text-xs font-black text-white font-heading">
                {bestStreak} {language === "vi" ? "ngày" : "days"}
              </span>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-dark-surface p-0.5 sm:p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] sm:text-xs ${
                viewMode === "calendar"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{language === "vi" ? "Lịch Tháng" : "Month"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("heatmap")}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] sm:text-xs ${
                viewMode === "heatmap"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === "calendar" && (
        <div className="space-y-4">
          {/* Calendar Month Controls & Stats Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-surface/50 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white text-sm px-2 min-w-[140px] text-center font-heading">
                {currentMonthLabel}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Tháng sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="ml-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              >
                {language === "vi" ? "Hôm nay" : "Today"}
              </button>
            </div>

            {/* Quick Month Metrics */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-brand-400" />
                <strong className="text-white font-bold">{monthTotalWorkouts}</strong>{" "}
                {language === "vi" ? "buổi tập" : "workouts"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <strong className="text-white font-bold">{monthTotalMinutes}</strong>{" "}
                {language === "vi" ? "phút" : "mins"}
              </span>
              <span className="flex items-center gap-1.5 hidden md:inline-flex">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <strong className="text-white font-bold">
                  {monthTotalVolume.toLocaleString()}
                </strong>{" "}
                kg
              </span>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="w-full">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              {weekDayHeaders.map((day, idx) => (
                <div
                  key={idx}
                  className={`py-1 ${
                    idx === 5 || idx === 6 ? "text-rose-400/80" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((dayItem, idx) => {
                const hasWorkout = Boolean(dayItem.activity);
                const isToday = dayItem.isToday;

                let cellBg = "bg-white/[0.02] border-white/5 text-slate-400";
                if (!dayItem.isCurrentMonth) {
                  cellBg = "bg-transparent border-transparent opacity-25 text-slate-600";
                } else if (hasWorkout) {
                  cellBg =
                    "bg-gradient-to-br from-brand-500/25 via-brand-accent/15 to-purple-500/20 border-brand-500/40 text-white shadow-sm shadow-brand-500/10 hover:border-brand-400 hover:shadow-brand-500/20";
                } else {
                  cellBg = "bg-white/[0.02] border-white/5 hover:border-white/15 text-slate-300";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (hasWorkout) {
                        setSelectedDayItem({
                          dateStr: dayItem.dateStr,
                          activity: dayItem.activity,
                        });
                      }
                    }}
                    className={`relative min-h-[44px] sm:min-h-[62px] p-1 sm:p-1.5 rounded-lg sm:rounded-xl border flex flex-col justify-between transition-all duration-200 ${cellBg} ${
                      hasWorkout ? "cursor-pointer active:scale-95" : ""
                    } ${
                      isToday
                        ? "ring-2 ring-brand-400 ring-offset-1 sm:ring-offset-2 ring-offset-dark-card"
                        : ""
                    }`}
                  >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            hasWorkout
                              ? "text-brand-300 font-heading"
                              : dayItem.isCurrentMonth
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          {dayItem.dayNum}
                        </span>

                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                        )}
                      </div>

                      {/* Workout indicator badge */}
                      {hasWorkout && dayItem.activity && (
                        <div className="mt-1 flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-white bg-brand-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-brand-400/30">
                            <span>🏋️‍♀️</span>
                            <span className="hidden sm:inline">
                              {dayItem.activity.duration_minutes}m
                            </span>
                          </span>

                          {dayItem.activity.workout_count > 1 && (
                            <span className="text-[9px] font-extrabold text-amber-300 bg-amber-500/20 px-1 rounded">
                              x{dayItem.activity.workout_count}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* VIEW 2: 16-WEEK ACTIVITY HEATMAP (GitHub Contribution Style) */}
      {viewMode === "heatmap" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{language === "vi" ? "Biểu Đồ Hoạt Động 16 Tuần Qua" : "Activity Matrix (Last 16 Weeks)"}</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>{language === "vi" ? "Ít" : "Less"}</span>
              <span className="w-3 h-3 rounded-sm bg-white/5 border border-white/10" />
              <span className="w-3 h-3 rounded-sm bg-brand-500/30 border border-brand-500/40" />
              <span className="w-3 h-3 rounded-sm bg-brand-500/70 border border-brand-400" />
              <span className="w-3 h-3 rounded-sm bg-gradient-to-tr from-brand-500 to-rose-500 shadow-sm shadow-brand-500/30" />
              <span>{language === "vi" ? "Nhiều" : "More"}</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex gap-1.5 min-w-[500px]">
              {/* Day of week labels */}
              <div className="flex flex-col gap-1.5 text-[10px] font-bold text-slate-500 pr-1.5 pt-0.5 select-none">
                <span className="h-4 leading-4">T2</span>
                <span className="h-4 leading-4 opacity-0">T3</span>
                <span className="h-4 leading-4">T4</span>
                <span className="h-4 leading-4 opacity-0">T5</span>
                <span className="h-4 leading-4">T6</span>
                <span className="h-4 leading-4 opacity-0">T7</span>
                <span className="h-4 leading-4 text-rose-400/60">CN</span>
              </div>

              {/* 16 Weekly Columns */}
              {heatmapData.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((cell, dIdx) => {
                    let levelClass = "bg-white/5 border-white/5 hover:border-white/20";
                    if (cell.level === 1) {
                      levelClass =
                        "bg-brand-500/30 border-brand-500/40 hover:bg-brand-500/40 shadow-sm shadow-brand-500/10 cursor-pointer";
                    } else if (cell.level === 2) {
                      levelClass =
                        "bg-brand-500/70 border-brand-400 hover:bg-brand-500/80 text-white shadow-sm shadow-brand-500/25 cursor-pointer";
                    } else if (cell.level === 3) {
                      levelClass =
                        "bg-gradient-to-tr from-brand-500 to-rose-500 border-rose-400 hover:brightness-110 text-white shadow-md shadow-brand-500/30 cursor-pointer";
                    }

                    const tooltipText = cell.activity
                      ? `${cell.dateStr}: ${cell.activity.workout_count} ${
                          language === "vi" ? "buổi tập" : "session(s)"
                        } (${cell.activity.duration_minutes}m, ${cell.activity.total_volume_kg}kg)`
                      : `${cell.dateStr}: ${language === "vi" ? "Nghỉ ngơi" : "Rest day"}`;

                    return (
                      <div
                        key={dIdx}
                        title={tooltipText}
                        onClick={() => {
                          if (cell.activity) {
                            setSelectedDayItem({
                              dateStr: cell.dateStr,
                              activity: cell.activity,
                            });
                          }
                        }}
                        className={`w-4 h-4 rounded-sm border transition-all ${levelClass} ${
                          cell.isToday ? "ring-1 ring-brand-300 ring-offset-1 ring-offset-dark-card" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAY WORKOUT DETAILS POPUP / MODAL */}
      {selectedDayItem && selectedDayItem.activity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card rounded-2xl max-w-sm w-full p-5 space-y-4 border border-brand-500/30 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-white font-heading">
                    {language === "vi" ? "Chi Tiết Ngày Tập" : "Workout Session Details"}
                  </h4>
                  <p className="text-[11px] text-brand-300 font-mono">
                    {selectedDayItem.dateStr}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-dark-surface border border-white/5 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {language === "vi" ? "Số buổi" : "Workouts"}
                </span>
                <span className="text-sm font-black text-white font-heading">
                  {selectedDayItem.activity.workout_count}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {language === "vi" ? "Thời gian" : "Duration"}
                </span>
                <span className="text-sm font-black text-brand-400 font-heading">
                  {selectedDayItem.activity.duration_minutes}m
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {language === "vi" ? "Khối lượng" : "Volume"}
                </span>
                <span className="text-sm font-black text-purple-400 font-heading">
                  {selectedDayItem.activity.total_volume_kg.toLocaleString()}kg
                </span>
              </div>
            </div>

            {/* Workout Titles */}
            {selectedDayItem.activity.titles && selectedDayItem.activity.titles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  {language === "vi" ? "Các buổi tập đã ghi nhận:" : "Logged Workouts:"}
                </span>
                <div className="space-y-1">
                  {selectedDayItem.activity.titles.map((title, tIdx) => (
                    <div
                      key={tIdx}
                      className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 flex items-center gap-2"
                    >
                      <span className="text-brand-400">✨</span>
                      <span className="font-semibold truncate">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedDayItem(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all"
            >
              {language === "vi" ? "Đóng" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
