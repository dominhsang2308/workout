import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Sparkles,
  Filter,
  Trash2,
  Video,
  Play,
  AlertCircle,
  Home,
  Dumbbell as DumbbellIcon,
  CheckCircle2,
  Layers,
  Flame,
  Zap,
  Sprout,
  RotateCcw,
} from "lucide-react";
import { exerciseService } from "../services/exercise.service";
import { Exercise } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { ExerciseVideoModal } from "../components/ExerciseVideoModal";
import { ExerciseRecommendationModal } from "../components/ExerciseRecommendationModal";
import {
  getLocalizedExercise,
  isHomeExercise,
  isGymExercise,
  getExerciseEnvironment,
  EQUIPMENT_TRANSLATIONS,
} from "../i18n/exerciseTranslations";

const MUSCLE_GROUPS = [
  "All",
  "Glutes",
  "Legs",
  "Core",
  "Arms",
  "Back",
  "Chest",
  "Shoulders",
  "Full Body",
];

const HOME_EQUIPMENTS = [
  "All",
  "Bodyweight",
  "Resistance Band",
  "Yoga Mat",
];

const GYM_EQUIPMENTS = [
  "All",
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
];

const ALL_EQUIPMENTS = [
  "All",
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Resistance Band",
  "Yoga Mat",
];

const DIFFICULTY_LEVELS = [
  "All",
  "Beginner",
  "Intermediate",
  "Experienced",
] as const;

export const Exercises: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Multi-select exercises for instant workout
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);

  // Section division: 1. Home Workout vs 2. Gym / Fitness Center vs All
  const [activeSection, setActiveSection] = useState<"home" | "gym" | "all">("home");

  // Detail Modal
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Video Tutorial Modal
  const [videoExercise, setVideoExercise] = useState<Exercise | null>(null);

  // Recommendation Modal
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // Toggle selection of an exercise
  const toggleSelectExercise = (id: number) => {
    if (selectedExerciseIds.includes(id)) {
      setSelectedExerciseIds(selectedExerciseIds.filter((item) => item !== id));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, id]);
    }
  };

  // Launch Active Workout with selected exercises
  const handleStartWorkoutWithSelected = (specificExercises?: Exercise[]) => {
    const chosen =
      specificExercises ||
      exercises.filter((e) => selectedExerciseIds.includes(e.id));
    if (chosen.length === 0) return;

    const title =
      chosen.length === 1
        ? (language === "vi" ? `Tập: ${chosen[0].name}` : `Workout: ${chosen[0].name}`)
        : (language === "vi"
            ? `Buổi Tập Đã Chọn (${chosen.length} bài)`
            : `Selected Workout (${chosen.length} exercises)`);

    const routine = {
      id: 0,
      name: title,
      description:
        language === "vi"
          ? `Buổi tập gồm ${chosen.length} bài tập được chọn từ thư viện.`
          : `Custom workout containing ${chosen.length} exercises selected from the library.`,
      items: chosen.map((ex, idx) => ({
        exercise_id: ex.id,
        order_index: idx + 1,
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        exercise: ex,
      })),
    };

    sessionStorage.setItem("active_workout_plan", JSON.stringify(routine));
    localStorage.setItem("active_workout_plan", JSON.stringify(routine));
    navigate("/active-workout", { state: { plan: routine } });
  };

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formMuscle, setFormMuscle] = useState("Glutes");
  const [formEquipment, setFormEquipment] = useState("Bodyweight");
  const [formCategory, setFormCategory] = useState("Toning");
  const [formDifficulty, setFormDifficulty] = useState<"Beginner" | "Intermediate" | "Experienced">("Beginner");
  const [formDesc, setFormDesc] = useState("");
  const [formInstr, setFormInstr] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formEnvironment, setFormEnvironment] = useState<"home" | "gym">("home");
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await exerciseService.getExercises();
      setExercises(data);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSectionChange = (section: "home" | "gym" | "all") => {
    setActiveSection(section);
    // If currently selected equipment conflicts with the new section, reset it
    if (section === "home" && ["Barbell", "Dumbbell", "Cable", "Machine"].includes(selectedEquipment)) {
      setSelectedEquipment("All");
    } else if (section === "gym" && ["Resistance Band", "Yoga Mat"].includes(selectedEquipment)) {
      setSelectedEquipment("All");
    }
  };

  const handleEquipmentChange = (eq: string) => {
    setSelectedEquipment(eq);
    // Automatically align section if equipment belongs specifically to Home or Gym
    if (["Resistance Band", "Yoga Mat"].includes(eq) && activeSection === "gym") {
      setActiveSection("home");
    } else if (["Barbell", "Dumbbell", "Cable", "Machine"].includes(eq) && activeSection === "home") {
      setActiveSection("gym");
    }
  };

  const resetAllFilters = () => {
    setSelectedMuscle("All");
    setSelectedEquipment("All");
    setSelectedDifficulty("All");
    setSearch("");
  };

  const isFilterActive =
    selectedMuscle !== "All" ||
    selectedEquipment !== "All" ||
    selectedDifficulty !== "All" ||
    search.trim() !== "";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError(t("exercises.nameLabel"));
      return;
    }
    setFormError(null);
    setCreateLoading(true);
    try {
      const newEx = await exerciseService.createExercise({
        name: formName.trim(),
        muscle_group: formMuscle,
        equipment: formEquipment,
        category: formCategory,
        difficulty: formDifficulty,
        description: formDesc.trim() || undefined,
        instructions: formInstr.trim() || undefined,
        video_url: formVideoUrl.trim() || undefined,
      });
      setExercises((prev) => [newEx, ...prev]);
      setIsCreateOpen(false);
      // Reset form
      setFormName("");
      setFormDesc("");
      setFormInstr("");
      setFormVideoUrl("");
      setFormEnvironment("home");
      setFormDifficulty("Beginner");
    } catch (err: any) {
      setFormError(err.response?.data?.detail || t("common.error"));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteExercise = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t("exercises.deleteConfirm"))) {
      return;
    }
    try {
      await exerciseService.deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
      if (selectedExercise?.id === id) {
        setSelectedExercise(null);
      }
      if (videoExercise?.id === id) {
        setVideoExercise(null);
      }
    } catch (err) {
      alert(t("common.error"));
    }
  };

  // Environment counts
  const homeCount = exercises.filter((ex) => isHomeExercise(ex)).length;
  const gymCount = exercises.filter((ex) => isGymExercise(ex)).length;

  const currentEquipments =
    activeSection === "home"
      ? HOME_EQUIPMENTS
      : activeSection === "gym"
      ? GYM_EQUIPMENTS
      : ALL_EQUIPMENTS;

  // Filtered exercises according to active section, equipment, muscle & difficulty level
  const displayedExercises = exercises.filter((ex) => {
    // 1. Search filter (bilingual search in exercise name, muscle group, equipment)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const localized = getLocalizedExercise(ex, language);
      const matchName =
        ex.name.toLowerCase().includes(q) ||
        localized.name.toLowerCase().includes(q);
      const matchMuscle = ex.muscle_group.toLowerCase().includes(q);
      const matchEquipment =
        ex.equipment.toLowerCase().includes(q) ||
        localized.equipment.toLowerCase().includes(q);
      if (!matchName && !matchMuscle && !matchEquipment) {
        return false;
      }
    }

    // 2. Equipment & Section filter
    if (selectedEquipment !== "All") {
      if (ex.equipment !== selectedEquipment) return false;
    } else {
      // When equipment is "All", respect the section division
      if (activeSection === "home" && !isHomeExercise(ex)) return false;
      if (activeSection === "gym" && !isGymExercise(ex)) return false;
    }

    // 3. Muscle Group filter
    if (selectedMuscle !== "All" && ex.muscle_group !== selectedMuscle) {
      return false;
    }

    // 4. Difficulty Level filter
    if (selectedDifficulty !== "All" && ex.difficulty !== selectedDifficulty) {
      return false;
    }

    return true;
  });

  const selectedExerciseLocalized = selectedExercise
    ? getLocalizedExercise(selectedExercise, language)
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
            <span>🌸 {t("exercises.title")}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20 hidden sm:inline-flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              {language === "vi" ? "100% Kèm Video Kỹ Thuật" : "100% Video Tutorials"}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("exercises.subtitle")}
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
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t("exercises.addNew")}</span>
          </button>
        </div>
      </div>

      {/* SECTION SELECTOR TABS: 1. HOME WORKOUT vs 2. GYM / FITNESS CENTER vs ALL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Section 1: Home Workout */}
        <button
          type="button"
          onClick={() => handleSectionChange("home")}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
            activeSection === "home"
              ? "bg-gradient-to-br from-emerald-950/40 via-dark-card to-rose-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
              : "bg-dark-card/60 hover:bg-dark-card border-white/5 hover:border-white/10"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  activeSection === "home"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  {language === "vi" ? "Khu Vực 1" : "Section 1"}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {t("exercises.tabHome")}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                activeSection === "home"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {homeCount} {language === "vi" ? "bài" : "exercises"}
            </span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {t("exercises.tabHomeDesc")}
          </p>
          {activeSection === "home" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
          )}
        </button>

        {/* Section 2: Gym & Fitness Center */}
        <button
          type="button"
          onClick={() => handleSectionChange("gym")}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
            activeSection === "gym"
              ? "bg-gradient-to-br from-indigo-950/40 via-dark-card to-purple-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
              : "bg-dark-card/60 hover:bg-dark-card border-white/5 hover:border-white/10"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  activeSection === "gym"
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <DumbbellIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
                  {language === "vi" ? "Khu Vực 2" : "Section 2"}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {t("exercises.tabGym")}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                activeSection === "gym"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {gymCount} {language === "vi" ? "bài" : "exercises"}
            </span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {t("exercises.tabGymDesc")}
          </p>
          {activeSection === "gym" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-brand-500" />
          )}
        </button>

        {/* Section 3: All Exercises */}
        <button
          type="button"
          onClick={() => handleSectionChange("all")}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
            activeSection === "all"
              ? "bg-gradient-to-br from-rose-950/40 via-dark-card to-brand-950/20 border-rose-500/50 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/30"
              : "bg-dark-card/60 hover:bg-dark-card border-white/5 hover:border-white/10"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  activeSection === "all"
                    ? "bg-gradient-to-tr from-brand-500 to-rose-500 text-white shadow-md shadow-brand-500/30"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-rose-400">
                  {language === "vi" ? "Toàn Diện" : "Overview"}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {t("exercises.tabAll")}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                activeSection === "all"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {exercises.length} {language === "vi" ? "bài" : "exercises"}
            </span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {language === "vi"
              ? "Hiển thị tổng thể toàn bộ bài tập tại nhà và phòng gym trên cùng một giao diện."
              : "Comprehensive view of both home workout routines and gym machinery."}
          </p>
          {activeSection === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-rose-400 to-pink-500" />
          )}
        </button>
      </div>

      {/* Standards & Gear Guidelines Banner */}
      {activeSection === "home" && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-dark-card to-teal-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-emerald-300">
                {language === "vi"
                  ? "Tiêu Chuẩn Tập Luyện Tại Nhà"
                  : "Home Workout Protocol"}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t("exercises.homeEquipmentNotice")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto shrink-0">
            {HOME_EQUIPMENTS.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => handleEquipmentChange(eq)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedEquipment === eq
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {eq === "All"
                  ? language === "vi"
                    ? "Tất Cả"
                    : "All"
                  : EQUIPMENT_TRANSLATIONS[eq]?.[language] || eq}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSection === "gym" && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-dark-card to-purple-950/20 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-indigo-300">
                {language === "vi"
                  ? "Tiêu Chuẩn Thiết Bị Phòng Gym & Fitness"
                  : "Gym & Fitness Machinery Standards"}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t("exercises.gymEquipmentNotice")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto shrink-0">
            {GYM_EQUIPMENTS.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => handleEquipmentChange(eq)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedEquipment === eq
                    ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/25"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {eq === "All"
                  ? language === "vi"
                    ? "Tất Cả"
                    : "All"
                  : EQUIPMENT_TRANSLATIONS[eq]?.[language] || eq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Row 1: Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("exercises.search")}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
          >
            {language === "vi" ? "Tìm Kiếm" : "Search"}
          </button>
        </form>

        {/* Row 2: DIFFICULTY LEVEL FILTER (Beginner / Intermediate / Experienced) */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === "vi" ? "Cấp Độ / Level:" : "Difficulty Level:"}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {DIFFICULTY_LEVELS.map((lvl) => {
              const isSelected = selectedDifficulty === lvl;
              let badgeColor = "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10";
              let icon = null;

              if (lvl === "All") {
                badgeColor = isSelected
                  ? "bg-gradient-to-r from-brand-500 to-rose-500 text-white shadow-sm shadow-brand-500/30"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10";
              } else if (lvl === "Beginner") {
                icon = <Sprout className="w-3.5 h-3.5" />;
                badgeColor = isSelected
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20";
              } else if (lvl === "Intermediate") {
                icon = <Zap className="w-3.5 h-3.5" />;
                badgeColor = isSelected
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                  : "text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20";
              } else if (lvl === "Experienced") {
                icon = <Flame className="w-3.5 h-3.5" />;
                badgeColor = isSelected
                  ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30"
                  : "text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20";
              }

              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${badgeColor}`}
                >
                  {icon}
                  <span>
                    {lvl === "All"
                      ? t("difficulty.All")
                      : t(`difficulty.${lvl}`, lvl)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Target Muscle & Filter Dropdowns */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-white/5">
          {/* Target Muscle Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                onClick={() => setSelectedMuscle(mg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedMuscle === mg
                    ? "bg-gradient-to-r from-brand-500 to-brand-accent text-white shadow-sm shadow-brand-500/30"
                    : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                {mg === "All" ? t("common.all") : t(`muscle.${mg}`, mg)}
              </button>
            ))}
          </div>

          {/* Dropdown Filters on the right */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto shrink-0">
            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5 bg-dark-surface border border-white/10 rounded-xl px-2.5 py-1.5 hover:border-white/20 transition-colors">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                aria-label={language === "vi" ? "Lọc theo cấp độ" : "Filter by difficulty level"}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="All" className="bg-dark-card text-white">
                  {language === "vi" ? "Tất Cả Cấp Độ" : "All Levels"}
                </option>
                <option value="Beginner" className="bg-dark-card text-white">
                  {language === "vi" ? "🌱 Cơ Bản (Beginner)" : "🌱 Beginner"}
                </option>
                <option value="Intermediate" className="bg-dark-card text-white">
                  {language === "vi" ? "⚡ Trung Bình (Intermediate)" : "⚡ Intermediate"}
                </option>
                <option value="Experienced" className="bg-dark-card text-white">
                  {language === "vi" ? "🔥 Nâng Cao (Experienced)" : "🔥 Experienced"}
                </option>
              </select>
            </div>

            {/* Equipment Dropdown */}
            <div className="flex items-center gap-1.5 bg-dark-surface border border-white/10 rounded-xl px-2.5 py-1.5 hover:border-white/20 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedEquipment}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                aria-label={t("common.filter")}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="All" className="bg-dark-card text-white">
                  {activeSection === "home"
                    ? language === "vi"
                      ? "Tất Cả Dụng Cụ Tại Nhà"
                      : "All Home Gear"
                    : activeSection === "gym"
                    ? language === "vi"
                      ? "Tất Cả Thiết Bị Gym"
                      : "All Gym Machinery"
                    : language === "vi"
                    ? "Tất Cả Dụng Cụ"
                    : "All Equipment"}
                </option>
                {currentEquipments
                  .filter((eq) => eq !== "All")
                  .map((eq) => {
                    const label = EQUIPMENT_TRANSLATIONS[eq]?.[language] || eq;
                    return (
                      <option key={eq} value={eq} className="bg-dark-card text-white">
                        {label}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Reset Filters button if any active */}
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                title={language === "vi" ? "Đặt lại bộ lọc" : "Reset filters"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === "vi" ? "Đặt Lại" : "Reset"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {loading ? (
        <LoadingSpinner message={t("common.loading")} />
      ) : displayedExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedExercises.map((exercise) => {
            const localized = getLocalizedExercise(exercise, language);
            const env = getExerciseEnvironment(exercise);
            const diff = exercise.difficulty || "Beginner";

            return (
              <div
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                  selectedExerciseIds.includes(exercise.id)
                    ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/15 ring-1 ring-brand-500/40"
                    : "hover:border-brand-500/40"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Muscle Group Badge */}
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                        {t(`muscle.${exercise.muscle_group}`, exercise.muscle_group)}
                      </span>

                      {/* Location Badge */}
                      {env === "home" ? (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1 shadow-sm shadow-emerald-500/10">
                          <span>🏠</span>
                          <span>{t("exercises.badgeHome")}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1 shadow-sm shadow-indigo-500/10">
                          <span>🏋️‍♀️</span>
                          <span>{t("exercises.badgeGym")}</span>
                        </span>
                      )}

                      {/* Difficulty Level Badge */}
                      {diff === "Beginner" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold flex items-center gap-1">
                          <span>🌱</span>
                          <span>{t("difficulty.short.Beginner")}</span>
                        </span>
                      )}
                      {diff === "Intermediate" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 font-semibold flex items-center gap-1">
                          <span>⚡</span>
                          <span>{t("difficulty.short.Intermediate")}</span>
                        </span>
                      )}
                      {diff === "Experienced" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 font-semibold flex items-center gap-1">
                          <span>🔥</span>
                          <span>{t("difficulty.short.Experienced")}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {exercise.is_custom && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                          {language === "vi" ? "Tùy Chỉnh" : "Custom"}
                        </span>
                      )}
                      {exercise.is_custom && exercise.user_id === user?.id && (
                        <button
                          onClick={(e) => handleDeleteExercise(exercise.id, e)}
                          title={t("common.delete")}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {localized.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {localized.description ||
                      localized.instructions ||
                      (language === "vi"
                        ? "Nhấn để xem video kỹ thuật & chi tiết thực hiện."
                        : "Click to watch tutorial & details.")}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />
                      {localized.equipment}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectExercise(exercise.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 border ${
                        selectedExerciseIds.includes(exercise.id)
                          ? "bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/25"
                          : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                      }`}
                      title={
                        selectedExerciseIds.includes(exercise.id)
                          ? (language === "vi" ? "Bỏ chọn" : "Deselect")
                          : (language === "vi" ? "Chọn bài tập này để bắt đầu tập" : "Select exercise for workout")
                      }
                    >
                      {selectedExerciseIds.includes(exercise.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{language === "vi" ? "Đã Chọn" : "Selected"}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{language === "vi" ? "Chọn Tập" : "Select"}</span>
                        </>
                      )}
                    </button>

                    {/* Watch Video Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoExercise(exercise);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-brand-500/20 hover:from-rose-500 hover:to-brand-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{language === "vi" ? "Xem Video" : "Video"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-brand-accent/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            {t("exercises.noFound")}
          </h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            {t("exercises.noFoundDesc")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/10 active:scale-95 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === "vi" ? "Đặt Lại Bộ Lọc" : "Reset Filters"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t("exercises.addNew")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <Modal
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
        title={
          selectedExerciseLocalized?.name ||
          (language === "vi" ? "Chi Tiết Bài Tập" : "Exercise Details")
        }
      >
        {selectedExercise && selectedExerciseLocalized && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
                {language === "vi" ? "Nhóm cơ:" : "Muscle:"}{" "}
                {t(
                  `muscle.${selectedExercise.muscle_group}`,
                  selectedExercise.muscle_group
                )}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">
                {language === "vi" ? "Dụng cụ:" : "Equipment:"}{" "}
                {selectedExerciseLocalized.equipment}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">
                {language === "vi" ? "Khu vực:" : "Location:"}{" "}
                {getExerciseEnvironment(selectedExercise) === "home"
                  ? t("exercises.badgeHome")
                  : t("exercises.badgeGym")}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5">
                <span>{language === "vi" ? "Cấp độ:" : "Level:"}</span>
                <span className={
                  selectedExercise.difficulty === "Beginner"
                    ? "text-emerald-400 font-bold"
                    : selectedExercise.difficulty === "Intermediate"
                    ? "text-amber-400 font-bold"
                    : "text-rose-400 font-bold"
                }>
                  {selectedExercise.difficulty === "Beginner"
                    ? (language === "vi" ? "🌱 Cơ Bản" : "🌱 Beginner")
                    : selectedExercise.difficulty === "Intermediate"
                    ? (language === "vi" ? "⚡ Trung Bình" : "⚡ Intermediate")
                    : (language === "vi" ? "🔥 Nâng Cao" : "🔥 Experienced")}
                </span>
              </span>
            </div>

            {/* Video tutorial banner in detail modal */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-brand-950/40 border border-rose-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-brand-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {language === "vi"
                      ? "Video Hướng Dẫn Kỹ Thuật"
                      : "Technique Video Tutorial"}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {language === "vi"
                      ? "Xem video thị phạm chi tiết từng động tác (~25s)"
                      : "Watch step-by-step form breakdown (~25s)"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVideoExercise(selectedExercise)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-brand-500 hover:from-rose-400 hover:to-brand-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Video className="w-4 h-4" />
                <span>{language === "vi" ? "Mở Video" : "Play Video"}</span>
              </button>
            </div>

            {selectedExerciseLocalized.description && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {language === "vi" ? "Mô Tả" : "Description"}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedExerciseLocalized.description}
                </p>
              </div>
            )}

            {selectedExerciseLocalized.instructions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {language === "vi"
                    ? "Hướng Dẫn Kỹ Thuật"
                    : "Technique Instructions"}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-dark-surface p-3.5 rounded-xl border border-white/5">
                  {selectedExerciseLocalized.instructions}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleSelectExercise(selectedExercise.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  selectedExerciseIds.includes(selectedExercise.id)
                    ? "bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                }`}
              >
                {selectedExerciseIds.includes(selectedExercise.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{language === "vi" ? "Đã Chọn Vào Buổi Tập" : "Added to Workout"}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{language === "vi" ? "+ Thêm Vào Buổi Tập" : "+ Add to Workout"}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ex = selectedExercise;
                    setSelectedExercise(null);
                    handleStartWorkoutWithSelected([ex]);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 via-purple-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{language === "vi" ? "Bắt Đầu Tập Bài Này Ngay ⚡" : "Start This Workout Now ⚡"}</span>
                </button>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors"
                >
                  {t("common.close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Dedicated Video Tutorial Modal */}
      <ExerciseVideoModal
        exercise={videoExercise}
        isOpen={!!videoExercise}
        onClose={() => setVideoExercise(null)}
      />

      {/* Create Custom Exercise Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t("exercises.modalTitle")}
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateExercise} className="space-y-4">
          {/* Environment selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {language === "vi"
                ? "Môi Trường Tập Luyện Phù Hợp"
                : "Suitable Workout Environment"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setFormEnvironment("home");
                  setFormEquipment("Bodyweight");
                  setFormCategory("Toning");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all ${
                  formEnvironment === "home"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/20"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-sm">🏠</span>
                <span>{t("exercises.badgeHome")}</span>
                <span className="text-[10px] font-normal text-slate-400">
                  {language === "vi" ? "Thảm, Dây, Không tạ" : "Mat, Band, Bodyweight"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormEnvironment("gym");
                  setFormEquipment("Barbell");
                  setFormCategory("Hypertrophy");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all ${
                  formEnvironment === "gym"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-sm shadow-indigo-500/20"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-sm">🏋️‍♀️</span>
                <span>{t("exercises.badgeGym")}</span>
                <span className="text-[10px] font-normal text-slate-400">
                  {language === "vi" ? "Tạ đòn, Tạ đơn, Máy tập" : "Barbell, Dumbbell, Machines"}
                </span>
              </button>
            </div>
          </div>

          {/* Difficulty Level Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {language === "vi" ? "Cấp Độ / Độ Khó" : "Difficulty Level"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormDifficulty("Beginner")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  formDifficulty === "Beginner"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>🌱</span>
                <span>{t("difficulty.short.Beginner")}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormDifficulty("Intermediate")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  formDifficulty === "Intermediate"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>⚡</span>
                <span>{t("difficulty.short.Intermediate")}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormDifficulty("Experienced")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  formDifficulty === "Experienced"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>🔥</span>
                <span>{t("difficulty.short.Experienced")}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t("exercises.nameLabel")}
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder={t("exercises.namePlaceholder")}
              className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t("exercises.muscleGroupLabel")}
              </label>
              <select
                value={formMuscle}
                onChange={(e) => setFormMuscle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                {MUSCLE_GROUPS.filter((m) => m !== "All").map((m) => (
                  <option key={m} value={m}>
                    {t(`muscle.${m}`, m)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t("exercises.equipmentLabel")}
              </label>
              <select
                value={formEquipment}
                onChange={(e) => setFormEquipment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                {ALL_EQUIPMENTS.filter((e) => e !== "All").map((eq) => (
                  <option key={eq} value={eq}>
                    {EQUIPMENT_TRANSLATIONS[eq]?.[language] || eq}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t("exercises.categoryLabel")}
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="Toning">
                Toning ({language === "vi" ? "Săn Chắc" : "Tone"})
              </option>
              <option value="Strength">
                Strength ({language === "vi" ? "Sức Mạnh" : "Power"})
              </option>
              <option value="Hypertrophy">
                Hypertrophy (
                {language === "vi" ? "Săn Chắc & Tăng Cơ" : "Hypertrophy"})
              </option>
              <option value="Endurance">
                Endurance ({language === "vi" ? "Sức Bền" : "Endurance"})
              </option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">
                Flexibility ({language === "vi" ? "Linh Hoạt" : "Stretch"})
              </option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="HIIT">HIIT</option>
              <option value="Dance">
                Dance ({language === "vi" ? "Nhảy" : "Dance"})
              </option>
            </select>
          </div>

          {/* Video URL Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                {language === "vi"
                  ? "Link Video Hướng Dẫn (Tùy chọn)"
                  : "Video Tutorial Link (Optional)"}
              </span>
              <span className="text-[10px] text-slate-400 lowercase">
                (YouTube, MP4, v.v.)
              </span>
            </label>
            <input
              type="url"
              value={formVideoUrl}
              onChange={(e) => setFormVideoUrl(e.target.value)}
              placeholder="VD: https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              {language === "vi"
                ? "💡 Nếu để trống, hệ thống sẽ tự động ghép video chuẩn kỹ thuật theo tên bài tập."
                : "💡 If left blank, our system automatically links a verified tutorial video."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t("exercises.descriptionLabel")}
            </label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder={t("exercises.descPlaceholder")}
              rows={2}
              className="w-full px-3.5 py-2 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {language === "vi"
                ? "Hướng Dẫn Kỹ Thuật (Không bắt buộc)"
                : "Technique Cues (Optional)"}
            </label>
            <textarea
              value={formInstr}
              onChange={(e) => setFormInstr(e.target.value)}
              placeholder={
                language === "vi"
                  ? "Hướng dẫn từng bước thực hiện..."
                  : "Step-by-step guidance..."
              }
              rows={3}
              className="w-full px-3.5 py-2 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {createLoading ? t("common.loading") : t("exercises.createBtn")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Floating Action Bar for Selected Exercises */}
      {selectedExerciseIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="glass-card rounded-2xl p-3 sm:p-4 bg-dark-bg/95 backdrop-blur-xl border-brand-500/40 shadow-2xl shadow-brand-500/25 ring-1 ring-brand-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-500/30 shrink-0">
                {selectedExerciseIds.length}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {language === "vi"
                    ? `Đã chọn ${selectedExerciseIds.length} bài tập`
                    : `${selectedExerciseIds.length} exercises selected`}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedExerciseIds([])}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors underline"
                >
                  {language === "vi" ? "Bỏ chọn tất cả" : "Clear all"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartWorkoutWithSelected()}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 via-pink-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-500/30 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>
                  {language === "vi"
                    ? "Bắt Đầu Tập Ngay ⚡"
                    : "Start Workout ⚡"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Recommendation Modal */}
      <ExerciseRecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        allExercises={exercises}
      />
    </div>
  );
};
