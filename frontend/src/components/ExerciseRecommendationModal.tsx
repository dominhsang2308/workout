import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Home,
  Dumbbell,
  Layers,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Zap,
  BookmarkPlus,
  ArrowRight,
  X,
  AlertCircle,
  Check,
  Video,
} from "lucide-react";
import { Exercise } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { planService } from "../services/plan.service";
import {
  getLocalizedExercise,
  isHomeExercise,
  isGymExercise,
} from "../i18n/exerciseTranslations";
import { ExerciseVideoModal } from "./ExerciseVideoModal";
import {
  GlutesIcon,
  LegsIcon,
  CoreIcon,
  BackIcon,
  ChestIcon,
  ShouldersIcon,
  ArmsIcon,
  FullBodyIcon,
} from "./icons/MuscleIcons";

interface ExerciseRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  allExercises: Exercise[];
  onApplyPlan?: (plan: any) => void;
}

const MUSCLE_TARGETS = [
  {
    id: "Glutes",
    labelVi: "Mông Săn Chắc",
    labelEn: "Glutes & Hips",
    Icon: GlutesIcon,
    iconColor: "text-rose-400",
    activeClasses: "from-rose-500/25 to-pink-600/25 border-rose-500 shadow-rose-500/15",
  },
  {
    id: "Legs",
    labelVi: "Đùi Thon Gọn",
    labelEn: "Legs & Quads",
    Icon: LegsIcon,
    iconColor: "text-cyan-400",
    activeClasses: "from-cyan-500/25 to-blue-600/25 border-cyan-500 shadow-cyan-500/15",
  },
  {
    id: "Core",
    labelVi: "Bụng & Eo Thon",
    labelEn: "Core & Abs",
    Icon: CoreIcon,
    iconColor: "text-amber-400",
    activeClasses: "from-amber-500/25 to-orange-600/25 border-amber-500 shadow-amber-500/15",
  },
  {
    id: "Back",
    labelVi: "Lưng Gợi Cảm",
    labelEn: "Back & Posture",
    Icon: BackIcon,
    iconColor: "text-indigo-400",
    activeClasses: "from-indigo-500/25 to-sky-600/25 border-indigo-500 shadow-indigo-500/15",
  },
  {
    id: "Chest",
    labelVi: "Ngực Nở Nang",
    labelEn: "Chest & Upper",
    Icon: ChestIcon,
    iconColor: "text-red-400",
    activeClasses: "from-red-500/25 to-rose-600/25 border-red-500 shadow-red-500/15",
  },
  {
    id: "Shoulders",
    labelVi: "Vai Thon Đẹp",
    labelEn: "Shoulders",
    Icon: ShouldersIcon,
    iconColor: "text-violet-400",
    activeClasses: "from-violet-500/25 to-purple-600/25 border-violet-500 shadow-violet-500/15",
  },
  {
    id: "Arms",
    labelVi: "Bắp Tay Thon",
    labelEn: "Arms",
    Icon: ArmsIcon,
    iconColor: "text-yellow-400",
    activeClasses: "from-yellow-500/25 to-amber-600/25 border-yellow-500 shadow-yellow-500/15",
  },
  {
    id: "Full Body",
    labelVi: "Toàn Thân Năng Động",
    labelEn: "Full Body Tone",
    Icon: FullBodyIcon,
    iconColor: "text-purple-400",
    activeClasses: "from-brand-500/25 to-purple-600/25 border-brand-500 shadow-brand-500/15",
  },
];

export const ExerciseRecommendationModal: React.FC<ExerciseRecommendationModalProps> = ({
  isOpen,
  onClose,
  allExercises,
  onApplyPlan,
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Wizard Step: 1 = Customizing preferences, 2 = Displaying top 5 recommendations
  const [step, setStep] = useState<1 | 2>(1);

  // Preference state
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["Glutes"]);
  const [environment, setEnvironment] = useState<"home" | "gym" | "all">("all");
  const [difficulty, setDifficulty] = useState<string>("All");

  // Recommended exercises
  const [recommendedList, setRecommendedList] = useState<Exercise[]>([]);
  const [selectedExIds, setSelectedExIds] = useState<number[]>([]);
  const [savingPlan, setSavingPlan] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Video Preview Modal
  const [previewVideoEx, setPreviewVideoEx] = useState<Exercise | null>(null);

  if (!isOpen) return null;

  // Toggle muscle target (Max 3 focus areas)
  const toggleMuscle = (muscleId: string) => {
    if (muscleId === "Full Body") {
      setSelectedMuscles(["Full Body"]);
      return;
    }

    let next = selectedMuscles.filter((m) => m !== "Full Body");
    if (next.includes(muscleId)) {
      if (next.length > 1) {
        next = next.filter((m) => m !== muscleId);
      }
    } else {
      if (next.length >= 3) {
        next.shift(); // remove first, keep max 3
      }
      next.push(muscleId);
    }
    setSelectedMuscles(next.length > 0 ? next : ["Glutes"]);
  };

  // Generate top 5 exercises based on criteria
  const generateRecommendations = () => {
    let pool = [...allExercises];

    // Filter by environment
    if (environment === "home") {
      pool = pool.filter((e) => isHomeExercise(e));
    } else if (environment === "gym") {
      pool = pool.filter((e) => isGymExercise(e));
    }

    // Filter by difficulty level
    if (difficulty !== "All") {
      const matchDiff = pool.filter(
        (e) => (e.difficulty || "Beginner").toLowerCase() === difficulty.toLowerCase()
      );
      if (matchDiff.length >= 5) {
        pool = matchDiff;
      }
    }

    // Filter by target muscles
    let targetPool: Exercise[] = [];
    if (selectedMuscles.includes("Full Body")) {
      targetPool = pool;
    } else {
      targetPool = pool.filter((e) =>
        selectedMuscles.some((m) => e.muscle_group.toLowerCase().includes(m.toLowerCase()))
      );
    }

    // Fallback if not enough exercises match
    if (targetPool.length < 5) {
      targetPool = pool;
    }

    // Shuffle pool to give fresh variety
    const shuffled = [...targetPool].sort(() => 0.5 - Math.random());
    const top5 = shuffled.slice(0, 5);

    setRecommendedList(top5);
    setSelectedExIds(top5.map((e) => e.id));
    setStep(2);
    setSaveSuccessMsg(null);
  };

  // Toggle selection of individual recommended exercise (Max 5)
  const toggleSelectExercise = (id: number) => {
    if (selectedExIds.includes(id)) {
      if (selectedExIds.length > 1) {
        setSelectedExIds(selectedExIds.filter((item) => item !== id));
      }
    } else {
      if (selectedExIds.length < 5) {
        setSelectedExIds([...selectedExIds, id]);
      }
    }
  };

  // Action 1: Start Workout Now with selected 5 exercises
  const handleStartActiveWorkout = () => {
    const chosenExercises = recommendedList.filter((e) => selectedExIds.includes(e.id));
    if (chosenExercises.length === 0) return;

    const muscleNames = selectedMuscles.join(" - ");
    const planName =
      language === "vi"
        ? `Buổi Tập Gợi Ý: ${muscleNames}`
        : `Recommended Routine: ${muscleNames}`;

    const tempRoutine = {
      id: 0,
      name: planName,
      description:
        language === "vi"
          ? "Lộ trình 5 bài tập được cá nhân hóa theo mục tiêu của bạn."
          : "Personalized 5-exercise routine curated based on your target goals.",
      items: chosenExercises.map((ex, idx) => ({
        exercise_id: ex.id,
        order_index: idx + 1,
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        exercise: ex,
      })),
    };

    sessionStorage.setItem("active_workout_plan", JSON.stringify(tempRoutine));
    localStorage.setItem("active_workout_plan", JSON.stringify(tempRoutine));

    if (onApplyPlan) {
      onApplyPlan(tempRoutine);
    }

    onClose();
    navigate("/active-workout", { state: { plan: tempRoutine } });
  };

  // Action 2: Save as Permanent Routine
  const handleSaveAsRoutine = async () => {
    const chosenExercises = recommendedList.filter((e) => selectedExIds.includes(e.id));
    if (chosenExercises.length === 0) return;

    try {
      setSavingPlan(true);
      const muscleNames = selectedMuscles.join(" - ");
      const planName =
        language === "vi"
          ? `Giáo Án Gợi Ý: ${muscleNames} ✨`
          : `Curated Routine: ${muscleNames} ✨`;

      await planService.createPlan({
        name: planName,
        description:
          language === "vi"
            ? `Giáo án gồm ${chosenExercises.length} bài tập tối ưu cho phần ${muscleNames}.`
            : `Routine with ${chosenExercises.length} exercises targeting ${muscleNames}.`,
        difficulty: difficulty === "All" ? "Beginner" : difficulty,
        estimated_duration_min: 40,
        items: chosenExercises.map((ex, idx) => ({
          exercise_id: ex.id,
          order_index: idx + 1,
          target_sets: 3,
          target_reps: 12,
          rest_seconds: 60,
        })),
      });

      setSaveSuccessMsg(
        language === "vi"
          ? "Đã lưu thành giáo án thành công! Bạn có thể xem trong mục Lịch Tập."
          : "Successfully saved as a new routine! Check your Workout Plans."
      );

      setTimeout(() => {
        onClose();
        navigate("/plans");
      }, 1500);
    } catch (err) {
      console.error("Failed to save recommended routine:", err);
      alert(language === "vi" ? "Không thể lưu giáo án này" : "Failed to save routine");
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
        <div className="glass-card max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-7 border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                <Sparkles className="w-5 h-5 animate-spin text-white" style={{ animationDuration: "6s" }} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {t("recommendation.title")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t("recommendation.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: SELECT GOALS & PREFERENCES */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-left duration-200">
              {/* 1. Target Muscle Groups */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t("recommendation.step1Title")}</span>
                  </label>
                  <span className="text-[11px] text-brand-400 font-medium">
                    {t("recommendation.maxMusclesHint")}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {MUSCLE_TARGETS.map((item) => {
                    const isSelected = selectedMuscles.includes(item.id);
                    const label = language === "vi" ? item.labelVi : item.labelEn;
                    const IconComponent = item.Icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleMuscle(item.id)}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? `bg-gradient-to-b ${item.activeClasses} text-white shadow-lg scale-[1.02]`
                            : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl mb-1.5 flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? "bg-white/15 text-white shadow-inner scale-105"
                              : `${item.iconColor} bg-white/5 group-hover:bg-white/10 group-hover:scale-105`
                          }`}
                        >
                          <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Workout Environment */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  {t("recommendation.step2Env")}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEnvironment("home")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      environment === "home"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>{language === "vi" ? "Tại Nhà" : "Home"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnvironment("gym")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      environment === "gym"
                        ? "bg-brand-500/20 border-brand-500 text-brand-300 shadow-md"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Dumbbell className="w-4 h-4 text-brand-400" />
                    <span>{language === "vi" ? "Phòng Gym" : "Gym"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnvironment("all")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      environment === "all"
                        ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-md"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>{language === "vi" ? "Mọi Nơi" : "Any"}</span>
                  </button>
                </div>
              </div>

              {/* 3. Level */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  {t("recommendation.step3Level")}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["All", "Beginner", "Intermediate", "Experienced"].map((lvl) => {
                    const isSelected = difficulty === lvl;
                    const label =
                      language === "vi"
                        ? lvl === "All"
                          ? "Tất cả"
                          : lvl === "Beginner"
                          ? "Mới bắt đầu"
                          : lvl === "Intermediate"
                          ? "Trung cấp"
                          : "Nâng cao"
                        : lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? "bg-white text-slate-900 border-white shadow-md font-bold"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={generateRecommendations}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-purple-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t("recommendation.generate")}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RESULTS TOP 5 EXERCISES */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              {/* Result description */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t("recommendation.resultTitle")}
                  </h3>
                  <p className="text-[11px] text-brand-300">
                    {t("recommendation.resultSubtitle")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {selectedExIds.length} / 5 {language === "vi" ? "bài" : "ex"}
                  </span>
                  <button
                    onClick={generateRecommendations}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-200 font-medium transition-colors"
                    title={t("recommendation.shuffle")}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t("recommendation.shuffle")}</span>
                  </button>
                </div>
              </div>

              {/* Save Success Banner */}
              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Exercise Items List (Max 5) */}
              <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {recommendedList.map((ex, idx) => {
                  const isChecked = selectedExIds.includes(ex.id);
                  const localized = getLocalizedExercise(ex, language);

                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleSelectExercise(ex.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-brand-500/10 border-brand-500/40 shadow-sm"
                          : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Order & Checkbox */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                            isChecked
                              ? "bg-brand-500 text-white"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {isChecked ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {localized.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="text-brand-400 font-medium">
                              {t(`muscle.${ex.muscle_group}`, ex.muscle_group)}
                            </span>
                            <span>•</span>
                            <span>{localized.equipment}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] text-slate-300">
                              {ex.difficulty || "Beginner"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Video Preview Button */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {ex.video_url && (
                          <button
                            type="button"
                            onClick={() => setPreviewVideoEx(ex)}
                            className="p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors"
                            title={language === "vi" ? "Xem video hướng dẫn" : "Watch form video"}
                          >
                            <Play className="w-3.5 h-3.5 fill-purple-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors w-full sm:w-auto"
                >
                  ← {language === "vi" ? "Chọn lại nhóm cơ" : "Back to Goals"}
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Save Routine */}
                  <button
                    type="button"
                    disabled={savingPlan || selectedExIds.length === 0}
                    onClick={handleSaveAsRoutine}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all disabled:opacity-50"
                  >
                    <BookmarkPlus className="w-4 h-4 text-brand-400" />
                    <span>{savingPlan ? t("common.loading") : t("recommendation.saveRoutine")}</span>
                  </button>

                  {/* Start Active Workout */}
                  <button
                    type="button"
                    disabled={selectedExIds.length === 0}
                    onClick={handleStartActiveWorkout}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-black text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>{t("recommendation.startActive")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Video Modal */}
      {previewVideoEx && (
        <ExerciseVideoModal
          exercise={previewVideoEx}
          isOpen={!!previewVideoEx}
          onClose={() => setPreviewVideoEx(null)}
        />
      )}
    </>
  );
};
