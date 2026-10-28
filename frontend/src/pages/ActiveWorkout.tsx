import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Timer,
  Play,
  Pause,
  Plus,
  Check,
  Trash2,
  Trophy,
  Save,
  X,
  AlertCircle,
  Clock,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Video,
  Maximize2,
  ExternalLink,
  Sun,
  Zap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Target,
  List,
} from "lucide-react";
import { exerciseService } from "../services/exercise.service";
import { sessionService } from "../services/session.service";
import { Exercise, WorkoutPlan } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { Modal } from "../components/Modal";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { audioAlerts } from "../utils/audioAlerts";
import { getExerciseVideo } from "../utils/exerciseVideos";
import { getLocalizedExercise } from "../i18n/exerciseTranslations";
import { ExerciseVideoModal } from "../components/ExerciseVideoModal";
import { ExerciseRecommendationModal } from "../components/ExerciseRecommendationModal";

interface ActiveSet {
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe?: number;
  is_completed: boolean;
  notes?: string;
}

interface ActiveExerciseGroup {
  exercise_id: number;
  exercise_name: string;
  muscle_group: string;
  rest_seconds: number;
  sets: ActiveSet[];
}

export const ActiveWorkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  // Active workout state
  const [workoutTitle, setWorkoutTitle] = useState(
    language === "vi" ? "Buổi Tập Hôm Nay" : "Today's Workout"
  );
  const [planId, setPlanId] = useState<number | null>(null);
  const [startTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [notes, setNotes] = useState("");

  const [exerciseGroups, setExerciseGroups] = useState<ActiveExerciseGroup[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedAddExId, setSelectedAddExId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Screen Wake Lock State (keeps phone screen on during workouts)
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Single Exercise Focus Mode State (shows 1 exercise at a time)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"focus" | "all">("focus");
  const [showCompletedBanner, setShowCompletedBanner] = useState(false);

  // Autosave Draft & Benchmarks State
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [lastSessionSets, setLastSessionSets] = useState<
    Record<number, { weight_kg: number; reps: number }>
  >({});

  // Recommendation Modal
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // Video playback states in Active Workout
  const [expandedVideoIdx, setExpandedVideoIdx] = useState<number | null>(null);
  const [modalVideoExercise, setModalVideoExercise] = useState<Exercise | null>(null);
  const [pipVideoExercise, setPipVideoExercise] = useState<Exercise | null>(null);

  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [restInitial, setRestInitial] = useState(60);
  const [isAudioEnabled, setIsAudioEnabled] = useState(() =>
    audioAlerts.isSoundEnabled()
  );
  const [restFinishNotice, setRestFinishNotice] = useState(false);

  // Victory Finished Modal
  const [completedSummary, setCompletedSummary] = useState<{
    volume: number;
    durationMins: number;
    setsCount: number;
  } | null>(null);

  // Helper to dynamically apply a plan or set of exercises
  const applyWorkoutPlan = (plan: any, exList: Exercise[]) => {
    if (!plan) return;
    if (plan.name) setWorkoutTitle(plan.name);
    if (plan.id) setPlanId(plan.id);

    const items = plan.items || [];
    const groups: ActiveExerciseGroup[] = items.map((item: any) => {
      const exName =
        item.exercise?.name ||
        exList.find((e) => e.id === item.exercise_id)?.name ||
        (language === "vi" ? "Bài tập" : "Exercise");
      const mGroup =
        item.exercise?.muscle_group ||
        exList.find((e) => e.id === item.exercise_id)?.muscle_group ||
        "Full Body";

      const defaultSets: ActiveSet[] = [];
      const targetSets = item.target_sets || 3;
      for (let s = 1; s <= targetSets; s++) {
        defaultSets.push({
          set_number: s,
          weight_kg: 0,
          reps: item.target_reps || 12,
          rpe: item.target_rpe || undefined,
          is_completed: false,
        });
      }

      return {
        exercise_id: item.exercise_id,
        exercise_name: exName,
        muscle_group: mGroup,
        rest_seconds: item.rest_seconds || 60,
        sets: defaultSets,
      };
    });

    setExerciseGroups(groups);
  };

  // Screen Wake Lock API logic
  const requestWakeLock = async () => {
    if (typeof window !== "undefined" && "wakeLock" in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request("screen");
        wakeLockRef.current = lock;
        setIsWakeLockActive(true);
        lock.addEventListener("release", () => {
          setIsWakeLockActive(false);
        });
      } catch (err) {
        console.warn("Wake lock request failed:", err);
      }
    }
  };

  const toggleWakeLock = async () => {
    if (isWakeLockActive && wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (e) {}
      wakeLockRef.current = null;
      setIsWakeLockActive(false);
    } else {
      await requestWakeLock();
    }
  };

  useEffect(() => {
    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  // Prevent accidental tab closure or back navigation during active workout
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (exerciseGroups.length > 0 && !completedSummary) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [exerciseGroups.length, completedSummary]);

  // Initial Data Load + Benchmark Extraction + Draft Restoration
  useEffect(() => {
    const initData = async () => {
      try {
        const [exList, recentSessions] = await Promise.all([
          exerciseService.getExercises(),
          sessionService.getSessions().catch(() => []),
        ]);
        setAllExercises(exList);

        // Build map of last lifted weight & reps for each exercise
        const prevMap: Record<number, { weight_kg: number; reps: number }> = {};
        for (const sess of recentSessions) {
          for (const s of sess.sets || []) {
            if (s.exercise_id && !prevMap[s.exercise_id] && s.weight_kg > 0) {
              prevMap[s.exercise_id] = { weight_kg: s.weight_kg, reps: s.reps };
            }
          }
        }
        setLastSessionSets(prevMap);

        // 1. Check if plan was passed via location.state (from Gợi ý bài tập or Chọn bài tập)
        const statePlan = (location.state as any)?.plan;
        if (statePlan) {
          applyWorkoutPlan(statePlan, exList);
          sessionStorage.removeItem("active_workout_plan");
          localStorage.removeItem("active_workout_plan");
          return;
        }

        // 2. Check if plan was saved in sessionStorage or localStorage
        const storedPlanStr =
          sessionStorage.getItem("active_workout_plan") ||
          localStorage.getItem("active_workout_plan");

        if (storedPlanStr) {
          try {
            const plan: WorkoutPlan = JSON.parse(storedPlanStr);
            applyWorkoutPlan(plan, exList);
            sessionStorage.removeItem("active_workout_plan");
            localStorage.removeItem("active_workout_plan");
            return;
          } catch (e) {
            console.error("Failed to parse stored workout plan", e);
          }
        }

        // 3. Check if there's an ongoing workout draft in localStorage
        const draftStr = localStorage.getItem("active_workout_draft");
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            if (draft.exerciseGroups && draft.exerciseGroups.length > 0) {
              if (draft.workoutTitle) {
                let cleanTitle = String(draft.workoutTitle).trim();
                if (cleanTitle === "Buổi Tậ" || !cleanTitle) {
                  cleanTitle = language === "vi" ? "Buổi Tập Hôm Nay" : "Today's Workout";
                }
                setWorkoutTitle(cleanTitle);
              }
              if (draft.planId) setPlanId(draft.planId);
              if (draft.elapsedSeconds) setElapsedSeconds(draft.elapsedSeconds);
              if (draft.notes) setNotes(draft.notes);
              if (typeof draft.currentExerciseIdx === "number") {
                setCurrentExerciseIdx(draft.currentExerciseIdx);
              }
              if (draft.viewMode === "focus" || draft.viewMode === "all") {
                setViewMode(draft.viewMode);
              }
              setExerciseGroups(draft.exerciseGroups);
              setIsDraftRestored(true);
              return;
            }
          } catch (err) {
            console.warn("Failed to restore workout draft", err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [location.key, location.state]);

  // Autosave Draft to localStorage whenever workout details or sets change
  useEffect(() => {
    if (loading || completedSummary) return;
    if (exerciseGroups.length > 0) {
      const cleanTitle =
        workoutTitle.trim() === "Buổi Tậ" || !workoutTitle.trim()
          ? (language === "vi" ? "Buổi Tập Hôm Nay" : "Today's Workout")
          : workoutTitle;
      const draft = {
        workoutTitle: cleanTitle,
        planId,
        startTime: startTime.toISOString(),
        elapsedSeconds,
        notes,
        exerciseGroups,
        currentExerciseIdx,
        viewMode,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("active_workout_draft", JSON.stringify(draft));
    }
  }, [
    exerciseGroups,
    workoutTitle,
    notes,
    elapsedSeconds,
    planId,
    startTime,
    loading,
    completedSummary,
    currentExerciseIdx,
    viewMode,
  ]);


  // Workout duration stopwatch ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest countdown ticker with Web Audio synthesized cues & haptic alerts
  useEffect(() => {
    if (restRemaining === null) return;

    if (restRemaining === 0) {
      audioAlerts.playFinishChime();
      audioAlerts.triggerHaptic([120, 80, 200, 80, 300]);
      setRestFinishNotice(true);
      const hideTimeout = setTimeout(() => {
        setRestFinishNotice(false);
      }, 4500);
      setRestRemaining(null);

      // Auto-advance to next exercise if in focus mode and current exercise is completed
      if (viewMode === "focus" && showCompletedBanner) {
        setShowCompletedBanner(false);
        setCurrentExerciseIdx((prev) =>
          prev < exerciseGroups.length - 1 ? prev + 1 : prev
        );
      }

      return () => clearTimeout(hideTimeout);
    }

    if (restRemaining <= 3 && restRemaining >= 1) {
      // 3 & 2: 520Hz, 1: 660Hz higher pitch
      audioAlerts.playCountdownBeep(restRemaining === 1 ? 660 : 520, 0.12);
      audioAlerts.triggerHaptic(50);
    }

    const timer = setInterval(() => {
      setRestRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [restRemaining]);

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    audioAlerts.setSoundEnabled(next);
  };

  const formatStopwatch = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : ""}${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRestTimer = (seconds: number) => {
    setRestFinishNotice(false);
    audioAlerts.playStartTone();
    audioAlerts.triggerHaptic(40);
    setRestInitial(seconds);
    setRestRemaining(seconds);
  };

  const isGroupCompleted = (group?: ActiveExerciseGroup) => {
    return Boolean(
      group && group.sets.length > 0 && group.sets.every((s) => s.is_completed)
    );
  };

  const completedExercisesCount = exerciseGroups.filter((g) =>
    isGroupCompleted(g)
  ).length;

  const handleAddExerciseGroup = () => {
    if (!selectedAddExId) return;
    const ex = allExercises.find((e) => e.id === Number(selectedAddExId));
    if (!ex) return;

    setExerciseGroups((prev) => {
      const nextGroups = [
        ...prev,
        {
          exercise_id: ex.id,
          exercise_name: ex.name,
          muscle_group: ex.muscle_group,
          rest_seconds: 60,
          sets: [
            { set_number: 1, weight_kg: 0, reps: 12, is_completed: false },
            { set_number: 2, weight_kg: 0, reps: 12, is_completed: false },
            { set_number: 3, weight_kg: 0, reps: 12, is_completed: false },
          ],
        },
      ];
      // Switch focus to the newly added exercise in focus mode
      if (viewMode === "focus") {
        setCurrentExerciseIdx(nextGroups.length - 1);
      }
      return nextGroups;
    });
    setSelectedAddExId("");
  };

  const handleRemoveExerciseGroup = (groupIndex: number) => {
    setExerciseGroups((prev) => {
      const updated = prev.filter((_, i) => i !== groupIndex);
      setCurrentExerciseIdx((old) =>
        Math.max(0, Math.min(old, updated.length - 1))
      );
      return updated;
    });
  };

  const handleAddSet = (groupIndex: number) => {
    setExerciseGroups((prev) => {
      const updated = [...prev];
      const targetGroup = { ...updated[groupIndex] };
      const lastSet = targetGroup.sets[targetGroup.sets.length - 1];
      const newSetNum = targetGroup.sets.length + 1;

      targetGroup.sets = [
        ...targetGroup.sets,
        {
          set_number: newSetNum,
          weight_kg: lastSet ? lastSet.weight_kg : 0,
          reps: lastSet ? lastSet.reps : 12,
          is_completed: false,
        },
      ];
      updated[groupIndex] = targetGroup;
      return updated;
    });
  };

  const handleRemoveSet = (groupIndex: number, setIndex: number) => {
    setExerciseGroups((prev) => {
      const updated = [...prev];
      const targetGroup = { ...updated[groupIndex] };
      targetGroup.sets = targetGroup.sets.filter((_, i) => i !== setIndex);
      // Re-number sets
      targetGroup.sets = targetGroup.sets.map((s, idx) => ({
        ...s,
        set_number: idx + 1,
      }));
      updated[groupIndex] = targetGroup;
      return updated;
    });
  };

  const handleSetChange = (
    groupIndex: number,
    setIndex: number,
    field: keyof ActiveSet,
    val: any
  ) => {
    setExerciseGroups((prev) => {
      const updated = [...prev];
      const targetGroup = { ...updated[groupIndex] };
      const sets = [...targetGroup.sets];
      sets[setIndex] = { ...sets[setIndex], [field]: val };
      targetGroup.sets = sets;
      updated[groupIndex] = targetGroup;
      return updated;
    });
  };

  const handleToggleSetComplete = (groupIndex: number, setIndex: number) => {
    setExerciseGroups((prev) => {
      const updated = [...prev];
      const targetGroup = { ...updated[groupIndex] };
      const sets = [...targetGroup.sets];
      const nowComplete = !sets[setIndex].is_completed;
      sets[setIndex] = { ...sets[setIndex], is_completed: nowComplete };
      targetGroup.sets = sets;
      updated[groupIndex] = targetGroup;

      // If set marked complete, start rest timer and give haptic feedback
      if (nowComplete) {
        audioAlerts.triggerHaptic([60, 40, 80]);
        handleStartRestTimer(targetGroup.rest_seconds || 60);

        // Check if all sets in this exercise group are now completed!
        const allSetsNowDone =
          sets.length > 0 && sets.every((s) => s.is_completed);
        if (allSetsNowDone) {
          setShowCompletedBanner(true);
          audioAlerts.triggerHaptic([100, 60, 100, 60, 250]);
        }
      }
      return updated;
    });
  };

  // Live total volume & completed sets metrics
  const liveTotalVolume = exerciseGroups.reduce((acc, g) => {
    return (
      acc +
      g.sets.reduce((sAcc, s) => {
        return sAcc + (s.is_completed ? s.weight_kg * s.reps : 0);
      }, 0)
    );
  }, 0);

  const completedSetsCount = exerciseGroups.reduce((acc, g) => {
    return acc + g.sets.filter((s) => s.is_completed).length;
  }, 0);

  const handleFinishWorkout = async () => {
    if (exerciseGroups.length === 0) {
      setError(language === "vi" ? "Vui lòng thêm ít nhất một bài tập trước khi lưu." : "Please add at least one exercise before saving.");
      return;
    }

    const allLoggedSets: Array<{
      exercise_id: number;
      set_number: number;
      reps: number;
      weight_kg: number;
      rpe?: number | null;
      is_completed: boolean;
      notes?: string | null;
    }> = [];

    exerciseGroups.forEach((g) => {
      g.sets.forEach((s) => {
        allLoggedSets.push({
          exercise_id: g.exercise_id,
          set_number: s.set_number,
          reps: Number(s.reps) || 0,
          weight_kg: Number(s.weight_kg) || 0,
          rpe: s.rpe ? Number(s.rpe) : null,
          is_completed: s.is_completed,
          notes: s.notes || null,
        });
      });
    });

    if (allLoggedSets.length === 0) {
      setError(language === "vi" ? "Vui lòng ghi lại ít nhất một set." : "Please record at least one set.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const nowIso = new Date().toISOString();
      await sessionService.createSession({
        title: workoutTitle.trim() || (language === "vi" ? "Buổi Tập Hoàn Thành" : "Completed Workout"),
        plan_id: planId,
        started_at: startTime.toISOString(),
        completed_at: nowIso,
        duration_seconds: elapsedSeconds,
        notes: notes.trim() || undefined,
        sets: allLoggedSets,
      });

      // Clear draft on successful completion
      localStorage.removeItem("active_workout_draft");
      setIsDraftRestored(false);

      // Show celebratory modal
      setCompletedSummary({
        volume: liveTotalVolume,
        durationMins: Math.max(Math.round(elapsedSeconds / 60), 1),
        setsCount: completedSetsCount,
      });
    } catch (err: any) {
      console.error("Failed to save workout session", err);
      setError(
        err.response?.data?.detail || t("common.error")
      );
      setSaving(false);
    }
  };

  const handleDiscardWorkout = () => {
    localStorage.removeItem("active_workout_draft");
    setIsDiscardModalOpen(false);
    setIsDraftRestored(false);
    setExerciseGroups([]);
    navigate("/");
  };

  const renderExerciseCard = (group: ActiveExerciseGroup, gIdx: number) => {
    const isCompleted = isGroupCompleted(group);
    return (
      <div
        key={gIdx}
        className={`glass-card rounded-2xl p-5 space-y-4 transition-all duration-300 ${
          viewMode === "focus"
            ? "border-brand-500/30 shadow-xl shadow-brand-500/5 animate-in fade-in duration-200"
            : ""
        }`}
      >
        {/* Exercise Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs transition-colors ${
                isCompleted
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-gradient-to-tr from-brand-500/10 to-brand-accent/10 border-brand-500/20 text-brand-400"
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : gIdx + 1}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {group.exercise_name}
                </h3>
                {lastSessionSets[group.exercise_id] && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>
                      {t("active.lastSet")}: {lastSessionSets[group.exercise_id].weight_kg}kg × {lastSessionSets[group.exercise_id].reps}
                    </span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-brand-400 font-medium">
                {t(`muscle.${group.muscle_group}`, group.muscle_group)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            {/* Watch Video Button */}
            <button
              type="button"
              onClick={() => {
                setExpandedVideoIdx(expandedVideoIdx === gIdx ? null : gIdx);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                expandedVideoIdx === gIdx
                  ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30"
                  : "bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-brand-500/15 hover:from-rose-500/25 hover:to-brand-500/25 text-rose-300 hover:text-white border-rose-500/30"
              }`}
              title={language === "vi" ? "Xem video thị phạm kỹ thuật" : "Watch form tutorial"}
            >
              <Video className="w-3.5 h-3.5" />
              <span>
                {expandedVideoIdx === gIdx
                  ? (language === "vi" ? "Thu Gọn Video" : "Hide Video")
                  : (language === "vi" ? "Xem Video" : "Video")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStartRestTimer(group.rest_seconds || 60)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors border border-white/5"
            >
              <Timer className="w-3.5 h-3.5 text-brand-400" />
              <span>{group.rest_seconds}s {language === "vi" ? "Nghỉ" : "Rest"}</span>
            </button>

            <button
              onClick={() => handleRemoveExerciseGroup(gIdx)}
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
              title={t("common.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Video Player for Simultaneous Watching & Workout */}
        {expandedVideoIdx === gIdx && (() => {
          const currentEx =
            allExercises.find((e) => e.id === group.exercise_id) ||
            ({
              id: group.exercise_id,
              name: group.exercise_name,
              muscle_group: group.muscle_group,
              category: "Strength",
              equipment: "Bodyweight",
              difficulty: "Beginner",
            } as Exercise);

          const videoInfo = getExerciseVideo(currentEx);
          const isDirectMp4 =
            videoInfo.embedUrl.endsWith(".mp4") ||
            videoInfo.embedUrl.endsWith(".webm");

          return (
            <div className="rounded-2xl overflow-hidden border border-brand-500/30 bg-black/60 shadow-xl space-y-2 p-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>
                    {language === "vi"
                      ? "Video Hướng Dẫn Thị Phạm Chuẩn Form"
                      : "Exercise Technique Demonstration"}
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPipVideoExercise(currentEx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                    title={language === "vi" ? "Bật chế độ Video góc nhỏ (PiP)" : "Picture in Picture mode"}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">PiP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalVideoExercise(currentEx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                    title={language === "vi" ? "Mở toàn màn hình xem chi tiết" : "Open expanded modal"}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{language === "vi" ? "Chi tiết" : "Modal"}</span>
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/90">
                {isDirectMp4 ? (
                  <video
                    src={videoInfo.embedUrl}
                    controls
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={`${group.exercise_name} Technique Demonstration`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              {videoInfo.keyPoints &&
                videoInfo.keyPoints[language === "vi" ? "vi" : "en"]?.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1">
                    <span className="font-bold text-amber-300 block uppercase tracking-wider text-[10px]">
                      {language === "vi"
                        ? "💡 Lưu Ý Kỹ Thuật Động Tác:"
                        : "💡 Form Focus:"}
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 leading-relaxed text-[11px]">
                      {videoInfo.keyPoints[
                        language === "vi" ? "vi" : "en"
                      ].map((cue, cIdx) => (
                        <li key={cIdx}>{cue}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          );
        })()}

        {/* Sets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/5">
                <th className="py-2 px-2 text-center w-12">{t("active.set")}</th>
                <th className="py-2 px-3">{t("active.weight")}</th>
                <th className="py-2 px-3">{t("active.reps")}</th>
                <th className="py-2 px-2 text-center w-14">{t("active.rpe")}</th>
                <th className="py-2 px-2 text-center w-16">{language === "vi" ? "Xong" : "Done"}</th>
                <th className="py-2 px-1 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {group.sets.map((set, sIdx) => (
                <tr
                  key={sIdx}
                  className={`transition-colors ${
                    set.is_completed
                      ? "bg-brand-500/[0.04]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-2 px-2 text-center font-bold text-slate-300">
                    {set.set_number}
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      min="0"
                      value={set.weight_kg === 0 ? "" : set.weight_kg}
                      onChange={(e) =>
                        handleSetChange(
                          gIdx,
                          sIdx,
                          "weight_kg",
                          Number(e.target.value)
                        )
                      }
                      placeholder={
                        lastSessionSets[group.exercise_id]
                          ? String(lastSessionSets[group.exercise_id].weight_kg)
                          : "0"
                      }
                      className="w-20 px-2 py-2 bg-dark-surface border border-white/10 rounded-lg text-white font-semibold focus:outline-none focus:border-brand-500 text-center text-sm"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={set.reps === 0 ? "" : set.reps}
                      onChange={(e) =>
                        handleSetChange(
                          gIdx,
                          sIdx,
                          "reps",
                          Number(e.target.value)
                        )
                      }
                      placeholder={
                        lastSessionSets[group.exercise_id]
                          ? String(lastSessionSets[group.exercise_id].reps)
                          : "0"
                      }
                      className="w-16 px-2 py-2 bg-dark-surface border border-white/10 rounded-lg text-white font-semibold focus:outline-none focus:border-brand-500 text-center text-sm"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      min="1"
                      max="10"
                      value={set.rpe || ""}
                      onChange={(e) =>
                        handleSetChange(
                          gIdx,
                          sIdx,
                          "rpe",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="-"
                      className="w-12 px-1.5 py-2 bg-dark-surface border border-white/10 rounded-lg text-slate-300 text-center focus:outline-none focus:border-brand-500 text-xs"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleSetComplete(gIdx, sIdx)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                        set.is_completed
                          ? "bg-gradient-to-r from-brand-500 to-brand-accent text-white font-bold shadow-md shadow-brand-500/30 scale-105"
                          : "bg-dark-surface text-slate-500 hover:text-white border border-white/10"
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </button>
                  </td>

                  <td className="py-2 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSet(gIdx, sIdx)}
                      className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Set Button */}
        <button
          type="button"
          onClick={() => handleAddSet(gIdx)}
          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-white/5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("active.addSet")}</span>
        </button>

        {/* Stepper Navigation Footer (When in Focus Mode) */}
        {viewMode === "focus" && (
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Previous Exercise Button */}
            <button
              type="button"
              disabled={gIdx === 0}
              onClick={() => {
                setShowCompletedBanner(false);
                setCurrentExerciseIdx((prev) => Math.max(0, prev - 1));
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-semibold text-xs border border-white/10 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("active.prevExercise")}</span>
            </button>

            {/* Exercise completion status indicator */}
            <div className="flex-1 text-center">
              {isCompleted ? (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t("active.exerciseCompletedNotice")}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  {group.sets.filter((s) => s.is_completed).length} / {group.sets.length}{" "}
                  {language === "vi" ? "hiệp đã xong" : "sets done"}
                </span>
              )}
            </div>

            {/* Next Exercise OR Finish Button */}
            {gIdx < exerciseGroups.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setShowCompletedBanner(false);
                  setCurrentExerciseIdx((prev) => Math.min(exerciseGroups.length - 1, prev + 1));
                }}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  isCompleted
                    ? "bg-gradient-to-r from-brand-500 via-pink-500 to-purple-500 hover:from-brand-400 hover:to-purple-400 text-white shadow-lg shadow-brand-500/30 scale-102 animate-pulse"
                    : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                }`}
              >
                <span>
                  {t("active.nextExercise")}: {exerciseGroups[gIdx + 1]?.exercise_name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishWorkout}
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? t("common.loading") : t("active.finishBtn")}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={t("common.loading")} />;
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Banner & Stopwatch HUD */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 sticky top-18 z-30 shadow-xl border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              onBlur={() => {
                const clean = workoutTitle.trim();
                if (!clean || clean === "Buổi Tậ") {
                  setWorkoutTitle(
                    language === "vi" ? "Buổi Tập Hôm Nay" : "Today's Workout"
                  );
                }
              }}
              className="text-xl sm:text-2xl font-extrabold text-white font-heading bg-transparent border-b border-transparent hover:border-white/20 focus:border-brand-500 focus:outline-none w-full tracking-tight transition-colors"
              placeholder={
                language === "vi" ? "Buổi Tập Hôm Nay" : "Today's Workout"
              }
            />
            <p className="text-xs text-slate-400 mt-0.5">
              🌸 {language === "vi" ? "Đang tập" : "In Progress"} • {completedSetsCount} {language === "vi" ? "hiệp hoàn thành" : "sets completed"}
            </p>
          </div>

          {/* Stopwatch & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
            {/* Screen Wake Lock Toggle */}
            <button
              type="button"
              onClick={toggleWakeLock}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                isWakeLockActive
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
              title={isWakeLockActive ? t("active.wakeLockOn") : t("active.wakeLockOff")}
            >
              <Sun
                className={`w-3.5 h-3.5 ${
                  isWakeLockActive ? "text-amber-400 animate-spin" : ""
                }`}
                style={{ animationDuration: "12s" }}
              />
              <span className="hidden sm:inline">
                {isWakeLockActive ? t("active.wakeLockOn") : t("active.wakeLockOff")}
              </span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-surface border border-white/10 font-mono text-sm sm:text-base font-bold text-white">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>{formatStopwatch(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title={isTimerRunning ? (language === "vi" ? "Tạm dừng" : "Pause") : (language === "vi" ? "Tiếp tục" : "Resume")}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsRecommendOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-brand-500/25 hover:from-purple-600/40 hover:to-brand-500/40 border border-purple-500/35 text-purple-200 text-xs font-bold transition-all active:scale-95 shadow-sm"
              title={t("recommendation.btn")}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden md:inline">{t("recommendation.btn")}</span>
            </button>

            {/* Discard Workout Button */}
            {exerciseGroups.length > 0 && (
              <button
                type="button"
                onClick={() => setIsDiscardModalOpen(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/15 hover:text-rose-400 border border-white/5 text-slate-400 transition-colors"
                title={t("active.discardBtn")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleFinishWorkout}
              disabled={saving || exerciseGroups.length === 0}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t("common.loading") : t("active.finishBtn")}</span>
            </button>
          </div>
        </div>

        {/* Rest Timer HUD */}
        {restRemaining !== null && (
          <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Timer info & countdown */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all ${
                    restRemaining <= 3
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse scale-105"
                      : "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                  }`}
                >
                  <Timer
                    className={`w-4 h-4 ${
                      restRemaining <= 3 ? "animate-spin text-amber-300" : "text-brand-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-300">
                      {t("active.restTimer")}
                    </span>
                    {restRemaining <= 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        {t("active.getReady")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-xl font-black text-white tracking-wider">
                      {Math.floor(restRemaining / 60)}:
                      {(restRemaining % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      / {restInitial}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 ml-auto">
                {/* Audio Mute/Unmute */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                    isAudioEnabled
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                  title={
                    isAudioEnabled ? t("active.soundOn") : t("active.soundOff")
                  }
                >
                  {isAudioEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>

                {/* Quick -15s */}
                <button
                  type="button"
                  onClick={() =>
                    setRestRemaining((prev) =>
                      Math.max(0, (prev !== null ? prev : 0) - 15)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 font-medium active:scale-95 transition-all"
                >
                  -15s
                </button>

                {/* Quick +15s */}
                <button
                  type="button"
                  onClick={() =>
                    setRestRemaining((prev) => (prev !== null ? prev + 15 : 15))
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 font-medium active:scale-95 transition-all"
                >
                  +15s
                </button>

                {/* Quick +30s */}
                <button
                  type="button"
                  onClick={() =>
                    setRestRemaining((prev) => (prev !== null ? prev + 30 : 30))
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 font-medium active:scale-95 transition-all"
                >
                  +30s
                </button>

                {/* Skip button */}
                <button
                  type="button"
                  onClick={() => setRestRemaining(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs text-rose-300 font-medium active:scale-95 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t("active.skipRest")}</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  restRemaining <= 3
                    ? "bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse"
                    : "bg-gradient-to-r from-brand-500 to-brand-accent"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      ((restInitial - restRemaining) / (restInitial || 1)) * 100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Rest Finished Celebratory Alert Banner */}
        {restFinishNotice && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-brand-500/20 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Sparkles className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {t("active.restFinished")}
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  {language === "vi"
                    ? "Hãy bắt đầu hiệp tập tiếp theo với 100% năng lượng! 💪"
                    : "Give 100% focus and power to your next set! 💪"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRestFinishNotice(false)}
              className="p-1 rounded-lg text-emerald-300/70 hover:text-white hover:bg-emerald-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Draft Restored Banner */}
      {isDraftRestored && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-brand-950/80 via-purple-950/80 to-emerald-950/80 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-brand-200 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 shrink-0 border border-brand-500/30">
              <RotateCcw
                className="w-4 h-4 text-brand-400 animate-spin"
                style={{ animationDuration: "8s" }}
              />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {t("active.draftRestored")}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === "vi"
                  ? "Tiến trình tập luyện, các hiệp và thời gian đã được tự động lưu và khôi phục an toàn."
                  : "Your logged sets, weights, and elapsed duration were saved and automatically restored."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("active_workout_draft");
                setIsDraftRestored(false);
                setExerciseGroups([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all active:scale-95"
            >
              {t("active.clearDraft")}
            </button>
            <button
              type="button"
              onClick={() => setIsDraftRestored(false)}
              className="px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 text-brand-200 text-xs font-semibold transition-all active:scale-95"
            >
              {language === "vi" ? "Tiếp Tục Tập" : "Keep Working"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
      {/* Exercise Stepper & View Mode Switcher Header (When there are exercises) */}
      {exerciseGroups.length > 0 && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3.5 border border-brand-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Progress label & bar */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Target className="w-4 h-4 text-brand-400" />
                  <span>
                    {language === "vi" ? "Tiến độ buổi tập:" : "Workout Progress:"}{" "}
                    {completedExercisesCount}/{exerciseGroups.length}{" "}
                    {language === "vi" ? "bài hoàn thành" : "exercises done"}
                  </span>
                </span>
                <span className="font-mono text-brand-400 font-bold">
                  {Math.round((completedExercisesCount / exerciseGroups.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-accent transition-all duration-500 rounded-full"
                  style={{
                    width: `${(completedExercisesCount / exerciseGroups.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* View Mode Toggle: Focus vs All */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-surface border border-white/10 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("focus")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "focus"
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title={t("active.focusMode")}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t("active.focusMode")}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "all"
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title={t("active.allMode")}
              >
                <List className="w-3.5 h-3.5" />
                <span>{t("active.allMode")}</span>
              </button>
            </div>
          </div>

          {/* Exercise Tabs / Stepper pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {exerciseGroups.map((group, idx) => {
              const isCompleted = isGroupCompleted(group);
              const isCurrent = idx === currentExerciseIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setShowCompletedBanner(false);
                    setCurrentExerciseIdx(idx);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                    isCurrent && viewMode === "focus"
                      ? "bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20"
                      : isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent && viewMode === "focus"
                        ? "bg-brand-500 text-white"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </span>
                  <span className="truncate max-w-[140px]">{group.exercise_name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({group.sets.filter((s) => s.is_completed).length}/{group.sets.length})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Exercises Set Logging Cards or Empty Launcher */}
      {exerciseGroups.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-brand-500/25 max-w-2xl mx-auto shadow-2xl animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-pink-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto shadow-xl shadow-brand-500/20">
            <Sparkles className="w-10 h-10 text-brand-300 animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {language === "vi" ? "Hôm nay bạn muốn tập gì? 💕" : "What are we training today? 💕"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              {language === "vi"
                ? "Chưa có bài tập nào trong buổi này. Bạn có thể sử dụng gợi ý 5 bài tập tự động hoặc chọn bài từ thư viện để bắt đầu!"
                : "No exercises in this session yet. Generate 5 curated exercises or pick from the library!"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRecommendOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-purple-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === "vi" ? "✨ Gợi Ý 5 Bài Tập Tự Động" : "✨ Curate 5 Exercises For Me"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/exercises")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-colors"
            >
              <span>{language === "vi" ? "🔍 Chọn Từ Thư Viện Bài Tập" : "🔍 Browse & Pick Exercises"}</span>
            </button>
          </div>
        </div>
      ) : viewMode === "focus" ? (
        <div className="space-y-5">
          {(() => {
            const safeIdx = Math.max(
              0,
              Math.min(currentExerciseIdx, exerciseGroups.length - 1)
            );
            const currentGroup = exerciseGroups[safeIdx];
            return currentGroup ? renderExerciseCard(currentGroup, safeIdx) : null;
          })()}
        </div>
      ) : (
        <div className="space-y-5">
          {exerciseGroups.map((group, gIdx) => renderExerciseCard(group, gIdx))}
        </div>
      )}

      {/* Add New Exercise to Workout Selector */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center">
        <select
          value={selectedAddExId}
          onChange={(e) =>
            setSelectedAddExId(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full sm:flex-1 px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
        >
          <option value="">{language === "vi" ? "Chọn bài tập để thêm vào buổi tập..." : "Select exercise to add to workout..."}</option>
          {allExercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({t(`muscle.${ex.muscle_group}`, ex.muscle_group)} - {ex.equipment})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAddExerciseGroup}
          disabled={!selectedAddExId}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t("active.addExerciseBtn")}</span>
        </button>
      </div>

      {/* Workout Notes */}
      <div className="glass-card rounded-2xl p-5 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {t("active.notesLabel")}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("active.notesPlaceholder")}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Completed Workout Celebration Modal */}
      <Modal
        isOpen={!!completedSummary}
        onClose={() => navigate("/")}
        title={t("active.congratsTitle")}
      >
        {completedSummary && (
          <div className="text-center space-y-6 py-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-brand-accent mx-auto flex items-center justify-center shadow-xl shadow-brand-500/30 text-white animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white font-heading">
                {t("active.congratsTitle")}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t("active.congratsDesc")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-dark-surface border border-white/10 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t("history.duration")}
                </span>
                <span className="text-lg font-bold text-white font-heading">
                  {completedSummary.durationMins}m
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t("history.volume")}
                </span>
                <span className="text-lg font-bold text-brand-400 font-heading">
                  {completedSummary.volume.toLocaleString()} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t("history.sets")}
                </span>
                <span className="text-lg font-bold text-purple-400 font-heading">
                  {completedSummary.setsCount}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/history")}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                {t("nav.history")}
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
              >
                {t("nav.dashboard")}
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Floating Picture-in-Picture Mini Player for Multi-tasking while Workout */}
      {pipVideoExercise && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-72 sm:w-88 glass-card bg-[#12081d]/95 backdrop-blur-xl border border-brand-500/40 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 ring-1 ring-brand-500/30">
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-brand-950/90 to-purple-950/90 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
              <span className="text-xs font-bold text-white truncate font-heading">
                {getLocalizedExercise(pipVideoExercise, language).name}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setModalVideoExercise(pipVideoExercise);
                  setPipVideoExercise(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={language === "vi" ? "Mở toàn màn hình" : "Expand"}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPipVideoExercise(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={t("common.close")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video stream */}
          <div className="relative w-full aspect-video bg-black/95">
            {(() => {
              const vInfo = getExerciseVideo(pipVideoExercise);
              const isMp4 =
                vInfo.embedUrl.endsWith(".mp4") ||
                vInfo.embedUrl.endsWith(".webm");
              return isMp4 ? (
                <video
                  src={vInfo.embedUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={vInfo.embedUrl}
                  title={`${pipVideoExercise.name} PiP Demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              );
            })()}
          </div>
        </div>
      )}

      {/* Dedicated Video Tutorial Modal for Active Workout */}
      <ExerciseVideoModal
        exercise={modalVideoExercise}
        isOpen={!!modalVideoExercise}
        onClose={() => setModalVideoExercise(null)}
      />

      {/* Exercise Recommendation Modal */}
      <ExerciseRecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        allExercises={allExercises}
        onApplyPlan={(plan) => applyWorkoutPlan(plan, allExercises)}
      />

      {/* Discard Workout Confirmation Modal */}
      <Modal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        title={t("active.discardBtn")}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <p className="text-xs sm:text-sm">
              {t("active.discardConfirm")}
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDiscardModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleDiscardWorkout}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              {t("active.discardBtn")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

