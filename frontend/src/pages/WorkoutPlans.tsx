import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  PlayCircle,
  Clock,
  Trash2,
  X,
  AlertCircle,
  Heart,
  Sparkles,
} from "lucide-react";
import { planService } from "../services/plan.service";
import { exerciseService } from "../services/exercise.service";
import { WorkoutPlan, Exercise } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { ExerciseRecommendationModal } from "../components/ExerciseRecommendationModal";

interface NewItemRow {
  exercise_id: number;
  exercise_name: string;
  target_sets: number;
  target_reps: number;
  rest_seconds: number;
}

export const WorkoutPlans: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planDifficulty, setPlanDifficulty] = useState("Intermediate");
  const [planDuration, setPlanDuration] = useState(45);
  const [items, setItems] = useState<NewItemRow[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [plansData, exercisesData] = await Promise.all([
        planService.getPlans(),
        exerciseService.getExercises(),
      ]);
      setPlans(plansData);
      setAvailableExercises(exercisesData);
    } catch (err) {
      console.error("Failed to load workout plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddItem = () => {
    if (!selectedExerciseId) return;
    const ex = availableExercises.find((e) => e.id === Number(selectedExerciseId));
    if (!ex) return;

    setItems((prev) => [
      ...prev,
      {
        exercise_id: ex.id,
        exercise_name: ex.name,
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
      },
    ]);
    setSelectedExerciseId("");
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof NewItemRow,
    value: any
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) {
      setError(t("plans.planName"));
      return;
    }
    if (items.length === 0) {
      setError(t("plans.selectExercises"));
      return;
    }
    setError(null);
    setCreateLoading(true);
    try {
      const newPlan = await planService.createPlan({
        name: planName.trim(),
        description: planDesc.trim() || undefined,
        difficulty: planDifficulty,
        estimated_duration_min: Number(planDuration) || 45,
        items: items.map((item, idx) => ({
          exercise_id: item.exercise_id,
          order_index: idx + 1,
          target_sets: Number(item.target_sets),
          target_reps: Number(item.target_reps),
          rest_seconds: Number(item.rest_seconds),
        })),
      });

      setPlans((prev) => [newPlan, ...prev]);
      setIsModalOpen(false);
      // Reset form
      setPlanName("");
      setPlanDesc("");
      setItems([]);
    } catch (err: any) {
      setError(err.response?.data?.detail || t("common.error"));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!window.confirm(t("plans.deleteConfirm"))) return;
    try {
      await planService.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(t("common.error"));
    }
  };

  const handleStartWorkout = (plan: WorkoutPlan) => {
    sessionStorage.setItem("active_workout_plan", JSON.stringify(plan));
    navigate("/active-workout");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            🌸 {t("plans.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("plans.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsRecommendOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-brand-500 hover:from-purple-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-95 border border-purple-400/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{t("recommendation.btn")}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{t("plans.createNew")}</span>
          </button>
        </div>
      </div>

      {/* Routine Cards Grid */}
      {loading ? (
        <LoadingSpinner message={t("common.loading")} />
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-brand-500/30 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                      {plan.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~{plan.estimated_duration_min} {language === "vi" ? "phút" : "mins"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    title={t("common.delete")}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {plan.description}
                  </p>
                )}

                {/* Exercise List preview */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {language === "vi" ? "Bài Tập" : "Exercises"} ({plan.items.length})
                  </p>
                  <div className="space-y-1.5">
                    {plan.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id || item.order_index}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-dark-surface/50 border border-white/5"
                      >
                        <span className="text-slate-200 font-medium truncate max-w-[200px]">
                          {item.exercise?.name || "Exercise"}
                        </span>
                        <span className="text-slate-400 font-semibold text-[11px]">
                          {item.target_sets} {t("plans.targetSets").toLowerCase()} × {item.target_reps} {t("plans.targetReps").toLowerCase()}
                        </span>
                      </div>
                    ))}
                    {plan.items.length > 4 && (
                      <p className="text-[11px] text-brand-400/90 font-medium pl-1">
                        +{plan.items.length - 4} {language === "vi" ? "bài tập khác..." : "more exercises..."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Workout Action */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-brand-400" />
                  {language === "vi" ? "Sẵn sàng tập chưa?" : "Ready to workout?"}
                </span>
                <button
                  onClick={() => handleStartWorkout(plan)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{t("plans.startPlan")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={t("plans.noPlans")}
          description={t("plans.noPlansDesc")}
          actionText={t("plans.createFirst")}
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Routine Builder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("plans.modalTitle")}
        maxWidth="max-w-2xl"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t("plans.planName")}
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder={t("plans.planNamePlaceholder")}
              className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {language === "vi" ? "Độ Khó" : "Difficulty"}
              </label>
              <select
                value={planDifficulty}
                onChange={(e) => setPlanDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Beginner">{language === "vi" ? "Mới Bắt Đầu" : "Beginner"}</option>
                <option value="Intermediate">{language === "vi" ? "Trung Bình" : "Intermediate"}</option>
                <option value="Advanced">{language === "vi" ? "Nâng Cao" : "Advanced"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {language === "vi" ? "Thời Gian Ước Tính (Phút)" : "Est. Duration (Minutes)"}
              </label>
              <input
                type="number"
                min={10}
                max={240}
                value={planDuration}
                onChange={(e) => setPlanDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t("plans.description")}
            </label>
            <textarea
              value={planDesc}
              onChange={(e) => setPlanDesc(e.target.value)}
              placeholder={t("plans.descPlaceholder")}
              rows={2}
              className="w-full px-3.5 py-2 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Routine Exercises Builder */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {language === "vi" ? "Danh Sách Bài Tập" : "Exercise List"} ({items.length})
              </label>
            </div>

            {/* Add Exercise Selector */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedExerciseId}
                onChange={(e) =>
                  setSelectedExerciseId(e.target.value ? Number(e.target.value) : "")
                }
                className="flex-1 px-3 py-2 bg-dark-surface border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="">{language === "vi" ? "Chọn bài tập để thêm..." : "Select exercise to add..."}</option>
                {availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({t(`muscle.${ex.muscle_group}`, ex.muscle_group)} - {ex.equipment})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedExerciseId}
                className="px-3.5 py-2 bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === "vi" ? "Thêm" : "Add"}</span>
              </button>
            </div>

            {/* Rest Recommendation Guide Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
              <span className="text-base shrink-0 leading-none mt-0.5">💡</span>
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  {t("plans.restRecommendationTitle")}
                </p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {t("plans.restRecommendationDesc")}
                </p>
              </div>
            </div>

            {/* Added exercises table */}
            {items.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-dark-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[10px] text-brand-400">
                        {idx + 1}
                      </span>
                      <span>{it.exercise_name}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">{t("plans.targetSets")}:</span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={it.target_sets}
                          onChange={(e) =>
                            handleItemChange(idx, "target_sets", e.target.value)
                          }
                          className="w-12 px-1.5 py-1 bg-dark-bg border border-white/10 rounded text-center text-white text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">{t("plans.targetReps")}:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={it.target_reps}
                          onChange={(e) =>
                            handleItemChange(idx, "target_reps", e.target.value)
                          }
                          className="w-12 px-1.5 py-1 bg-dark-bg border border-white/10 rounded text-center text-white text-xs"
                        />
                      </div>

                      {/* Free Rest Seconds Input & Quick Chips */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[10px]">{t("plans.restSeconds")}:</span>
                        <input
                          type="number"
                          min={0}
                          max={600}
                          step={1}
                          inputMode="numeric"
                          value={it.rest_seconds === 0 ? "" : it.rest_seconds}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "rest_seconds",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          onBlur={() => {
                            if (!it.rest_seconds || it.rest_seconds <= 0) {
                              handleItemChange(idx, "rest_seconds", 60);
                            }
                          }}
                          placeholder="60"
                          className="w-16 px-1.5 py-1 bg-dark-bg border border-white/10 rounded text-center text-white font-semibold text-xs focus:outline-none focus:border-brand-500"
                        />
                        <div className="hidden sm:flex items-center gap-1">
                          {[30, 45, 60, 90].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => handleItemChange(idx, "rest_seconds", sec)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                                Number(it.rest_seconds) === sec
                                  ? "bg-brand-500 text-white shadow-sm"
                                  : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5"
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-auto sm:ml-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center border border-dashed border-white/10 rounded-xl">
                {language === "vi" ? "Chưa có bài tập nào. Chọn bài tập ở trên và nhấn \"Thêm\"." : "No exercises added yet. Select one above and click \"Add\"."}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {createLoading ? t("common.loading") : t("plans.createBtn")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Exercise Recommendation Modal */}
      <ExerciseRecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        allExercises={availableExercises}
      />
    </div>
  );
};
