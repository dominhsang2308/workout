import React, { useState, useEffect, useRef } from "react";
import {
  Utensils,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  Camera,
  Upload,
  X,
  AlertCircle,
  Sparkles,
  Flame,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Apple,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import { nutritionService, getFullImageUrl } from "../services/nutrition.service";
import { MealLog, MealLogCreate, MealType } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { Modal } from "../components/Modal";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MEAL_TYPES: {
  key: MealType;
  labelVi: string;
  labelEn: string;
  icon: any;
  colorClass: string;
  badgeBg: string;
}[] = [
  {
    key: "breakfast",
    labelVi: "Bữa Sáng",
    labelEn: "Breakfast",
    icon: Coffee,
    colorClass: "text-amber-400",
    badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  },
  {
    key: "lunch",
    labelVi: "Bữa Trưa",
    labelEn: "Lunch",
    icon: Sun,
    colorClass: "text-emerald-400",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  },
  {
    key: "afternoon_snack",
    labelVi: "Bữa Xế",
    labelEn: "Afternoon Snack",
    icon: Sunset,
    colorClass: "text-violet-400",
    badgeBg: "bg-violet-500/15 border-violet-500/30 text-violet-300",
  },
  {
    key: "dinner",
    labelVi: "Bữa Tối",
    labelEn: "Dinner",
    icon: Moon,
    colorClass: "text-blue-400",
    badgeBg: "bg-blue-500/15 border-blue-500/30 text-blue-300",
  },
  {
    key: "snack",
    labelVi: "Ăn Phụ / Khuya",
    labelEn: "Snack / Other",
    icon: Apple,
    colorClass: "text-rose-400",
    badgeBg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  },
];

// Local date utilities (avoids UTC timezone shift bug)
export const getLocalTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getYesterdayStr = (): string => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const shiftDateStr = (dateStr: string, days: number): string => {
  if (!dateStr) return getLocalTodayStr();
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d + days);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const VI_DAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const formatFullDateDisplay = (dateStr: string, lang: "vi" | "en") => {
  if (!dateStr) return { dayOfWeek: "", formattedDate: "", relativeLabel: null };
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const today = getLocalTodayStr();
  const yesterday = getYesterdayStr();
  const tomorrow = shiftDateStr(today, 1);

  const dayOfWeek = lang === "vi" ? VI_DAYS[dateObj.getDay()] : EN_DAYS[dateObj.getDay()];
  const formattedDate = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;

  let relativeLabel: string | null = null;
  if (dateStr === today) {
    relativeLabel = lang === "vi" ? "Hôm nay" : "Today";
  } else if (dateStr === yesterday) {
    relativeLabel = lang === "vi" ? "Hôm qua" : "Yesterday";
  } else if (dateStr === tomorrow) {
    relativeLabel = lang === "vi" ? "Ngày mai" : "Tomorrow";
  }

  return { dayOfWeek, formattedDate, relativeLabel };
};

export const Nutrition: React.FC = () => {
  const { t, language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<string>(getLocalTodayStr);
  const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState<string>("all");
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time ticking clock
  const [liveTime, setLiveTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Add Meal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMealType, setFormMealType] = useState<MealType>("breakfast");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCalories, setFormCalories] = useState<string>("");
  const [formProtein, setFormProtein] = useState<string>("");
  const [formCarbs, setFormCarbs] = useState<string>("");
  const [formFat, setFormFat] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(getLocalTodayStr);
  const [formTime, setFormTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Image Viewer Modal
  const [viewingImage, setViewingImage] = useState<{
    url: string;
    title: string;
    mealType: string;
  } | null>(null);

  // Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Load meals whenever date or filter changes
  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nutritionService.getMeals(
        selectedDate,
        selectedMealTypeFilter === "all" ? undefined : selectedMealTypeFilter
      );
      setMeals(data);
    } catch (err: any) {
      console.error("Failed to load meals:", err);
      setError(language === "vi" ? "Không thể tải nhật ký món ăn" : "Failed to load meal logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [selectedDate, selectedMealTypeFilter]);

  // Date navigation handlers
  const handlePrevDay = () => {
    setSelectedDate((prev) => shiftDateStr(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => shiftDateStr(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(getLocalTodayStr());
  };

  // Image selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(language === "vi" ? "Vui lòng chọn file hình ảnh hợp lệ!" : "Please select a valid image file!");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form with optional initial date
  const handleOpenAddModal = (targetDate?: string | React.MouseEvent) => {
    setFormMealType("breakfast");
    setFormTitle("");
    setFormDescription("");
    setFormCalories("");
    setFormProtein("");
    setFormCarbs("");
    setFormFat("");
    const dateToSet = typeof targetDate === "string" ? targetDate : (selectedDate || getLocalTodayStr());
    setFormDate(dateToSet);
    const now = new Date();
    setFormTime(
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
    setSelectedFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Submit new meal log
  const handleSubmitMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      setSubmitting(true);
      let uploadedImageUrl: string | undefined = undefined;

      // Upload file to server first if provided
      if (selectedFile) {
        uploadedImageUrl = await nutritionService.uploadImage(selectedFile);
      }

      const payload: MealLogCreate = {
        meal_type: formMealType,
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        image_url: uploadedImageUrl || undefined,
        date: formDate,
        time: formTime || undefined,
        calories: formCalories ? parseInt(formCalories, 10) : undefined,
        protein_g: formProtein ? parseFloat(formProtein) : undefined,
        carbs_g: formCarbs ? parseFloat(formCarbs) : undefined,
        fat_g: formFat ? parseFloat(formFat) : undefined,
      };

      await nutritionService.createMeal(payload);
      setIsModalOpen(false);

      // If user logged meal for a different date (e.g. yesterday), automatically jump to that date
      if (formDate !== selectedDate) {
        setSelectedDate(formDate);
      } else {
        await fetchMeals();
      }
    } catch (err: any) {
      console.error("Failed to save meal:", err);
      alert(
        err.response?.data?.detail ||
          (language === "vi" ? "Lưu món ăn thất bại, vui lòng thử lại!" : "Failed to save meal, please try again!")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteMeal = async (mealId: number) => {
    try {
      await nutritionService.deleteMeal(mealId);
      setDeleteConfirmId(null);
      await fetchMeals();
    } catch (err) {
      console.error("Failed to delete meal:", err);
      alert(language === "vi" ? "Không thể xóa món ăn này" : "Failed to delete meal");
    }
  };

  // Compute daily totals
  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = Math.round(meals.reduce((acc, m) => acc + (m.protein_g || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(meals.reduce((acc, m) => acc + (m.carbs_g || 0), 0) * 10) / 10;
  const totalFat = Math.round(meals.reduce((acc, m) => acc + (m.fat_g || 0), 0) * 10) / 10;

  const dateInfo = formatFullDateDisplay(selectedDate, language);

  const getMealMeta = (type: MealType) => {
    return (
      MEAL_TYPES.find((m) => m.key === type) || {
        key: type,
        labelVi: "Bữa ăn",
        labelEn: "Meal",
        icon: Utensils,
        colorClass: "text-brand-400",
        badgeBg: "bg-brand-500/15 border-brand-500/30 text-brand-300",
      }
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-emerald-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
            <Utensils className="w-6 h-6 text-brand-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{t("nutrition.title")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {t("nutrition.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("nutrition.addMeal")}</span>
        </button>
      </div>

      {/* Date Navigation & Real-time Live Bar */}
      <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 border border-white/10 shadow-xl">
        {/* Left: Previous, Active Date Badge, Next, Quick Day Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Previous Day */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/5"
            title={language === "vi" ? "Lùi lại 1 ngày" : "Previous day"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Active Date Banner */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-purple-500/15 to-transparent border border-brand-500/35 text-white shadow-sm">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {dateInfo.relativeLabel && (
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                  selectedDate === getLocalTodayStr()
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : selectedDate === getYesterdayStr()
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-brand-500/20 text-brand-300 border-brand-500/30"
                }`}>
                  {dateInfo.relativeLabel}
                </span>
              )}
              <span className="font-extrabold text-sm text-white">
                {dateInfo.dayOfWeek},
              </span>
              <span className="font-mono text-sm font-bold text-brand-300">
                {dateInfo.formattedDate}
              </span>
            </div>
          </div>

          {/* Next Day */}
          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/5"
            title={language === "vi" ? "Tiến tới 1 ngày" : "Next day"}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick preset buttons: Today & Yesterday */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={handleToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                selectedDate === getLocalTodayStr()
                  ? "bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/25"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
              }`}
            >
              {language === "vi" ? "Hôm nay" : "Today"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedDate(getYesterdayStr())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                selectedDate === getYesterdayStr()
                  ? "bg-amber-500/30 text-amber-200 border-amber-500/50 shadow-md shadow-amber-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
              }`}
            >
              {language === "vi" ? "Hôm qua" : "Yesterday"}
            </button>
          </div>
        </div>

        {/* Right: Live real-time clock & Calendar picker jump */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {/* Real-time Live Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-surface/90 border border-white/10 text-slate-300 font-mono text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
              {language === "vi" ? "Thời gian thực:" : "Live Clock:"}
            </span>
            <span className="font-bold text-emerald-300 tracking-wider">
              {liveTime}
            </span>
          </div>

          {/* Jump to specific date */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              {language === "vi" ? "Chọn ngày:" : "Jump to:"}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer font-mono"
            />
          </div>
        </div>
      </div>

      {/* Daily Nutrition Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {t("nutrition.mealsLogged")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Utensils className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {meals.length}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">
              {language === "vi" ? "món" : "meals"}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {t("nutrition.calories")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {totalCalories}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">
              kcal
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {t("nutrition.protein")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {totalProtein}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">
              g
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {t("nutrition.carbs")} / {t("nutrition.fat")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Apple className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            <span className="text-blue-300">{totalCarbs}g</span>
            <span className="text-slate-600 mx-1.5">/</span>
            <span className="text-purple-300">{totalFat}g</span>
          </div>
        </div>
      </div>

      {/* Filter by Meal Type */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedMealTypeFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedMealTypeFilter === "all"
              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
              : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("nutrition.allMeals")}
        </button>

        {MEAL_TYPES.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMealTypeFilter === m.key;
          const label = language === "vi" ? m.labelVi : m.labelEn;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMealTypeFilter(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-md"
                  : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Meal Cards Display */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner message={t("common.loading")} />
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : meals.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 opacity-80" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {t("nutrition.noMeals")}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t("nutrition.noMealsDesc")}
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-bold border border-brand-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t("nutrition.addMeal")}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meals.map((meal) => {
            const meta = getMealMeta(meal.meal_type);
            const Icon = meta.icon;
            const fullImg = getFullImageUrl(meal.image_url);

            return (
              <div
                key={meal.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/20 transition-all group flex flex-col"
              >
                {/* Image Banner */}
                {fullImg ? (
                  <div className="relative aspect-[16/10] w-full bg-black/40 overflow-hidden cursor-pointer">
                    <img
                      src={fullImg}
                      alt={meal.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onClick={() =>
                        setViewingImage({
                          url: fullImg,
                          title: meal.title,
                          mealType: language === "vi" ? meta.labelVi : meta.labelEn,
                        })
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Meal Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md border text-xs font-bold shadow-md">
                      <span className={`${meta.badgeBg} px-2 py-0.5 rounded-md flex items-center gap-1`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{language === "vi" ? meta.labelVi : meta.labelEn}</span>
                      </span>
                    </div>

                    {/* Time Badge */}
                    {meal.time && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-mono text-slate-200">
                        <Clock className="w-3 h-3 text-brand-400" />
                        <span>{meal.time}</span>
                      </div>
                    )}

                    {/* Expand icon on hover */}
                    <button
                      onClick={() =>
                        setViewingImage({
                          url: fullImg,
                          title: meal.title,
                          mealType: language === "vi" ? meta.labelVi : meta.labelEn,
                        })
                      }
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                      title={language === "vi" ? "Xem ảnh lớn" : "Enlarge photo"}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-tr from-brand-950/40 via-purple-950/30 to-slate-900 border-b border-white/5 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                      <span className={`${meta.badgeBg} px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{language === "vi" ? meta.labelVi : meta.labelEn}</span>
                      </span>
                    </div>
                    {meal.time && (
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        <span>{meal.time}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {meal.title}
                    </h3>
                    {meal.description && (
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {meal.description}
                      </p>
                    )}
                  </div>

                  {/* Macros info pills */}
                  {(meal.calories !== null ||
                    meal.protein_g !== null ||
                    meal.carbs_g !== null ||
                    meal.fat_g !== null) && (
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      {meal.calories !== null && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                          🔥 {meal.calories} kcal
                        </span>
                      )}
                      {meal.protein_g !== null && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                          🥩 P: {meal.protein_g}g
                        </span>
                      )}
                      {meal.carbs_g !== null && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                          🍚 C: {meal.carbs_g}g
                        </span>
                      )}
                      {meal.fat_g !== null && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                          🥑 F: {meal.fat_g}g
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => setDeleteConfirmId(meal.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={t("common.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={t("nutrition.addMeal")}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitMeal} className="space-y-4">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t("nutrition.mealType")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MEAL_TYPES.map((m) => {
                const Icon = m.icon;
                const isSelected = formMealType === m.key;
                const label = language === "vi" ? m.labelVi : m.labelEn;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setFormMealType(m.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-brand-500/20 border-brand-500 text-brand-300 shadow-md shadow-brand-500/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meal Date & Time Selector */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                {language === "vi" ? "Thời Gian Ghi Nhận Món Ăn" : "Log Date & Time"}
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormDate(getLocalTodayStr())}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all border ${
                    formDate === getLocalTodayStr()
                      ? "bg-brand-500 text-white border-brand-400"
                      : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/5"
                  }`}
                >
                  {language === "vi" ? "Hôm nay" : "Today"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormDate(getYesterdayStr())}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all border ${
                    formDate === getYesterdayStr()
                      ? "bg-amber-500 text-white border-amber-400"
                      : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/5"
                  }`}
                >
                  {language === "vi" ? "Hôm qua" : "Yesterday"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  {language === "vi" ? "Ngày ăn:" : "Meal Date:"}
                </span>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors font-mono cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-400">
                    {language === "vi" ? "Giờ ăn:" : "Meal Time:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setFormTime(
                        `${now.getHours().toString().padStart(2, "0")}:${now
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`
                      );
                    }}
                    className="text-[10px] text-brand-400 hover:text-brand-300 underline font-medium"
                  >
                    {language === "vi" ? "Lấy giờ hiện tại" : "Set to Now"}
                  </button>
                </div>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors font-mono cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Meal Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t("nutrition.foodTitle")}
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={t("nutrition.foodTitlePlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Photo Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t("nutrition.uploadPhoto")}
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-brand-500/30 bg-black/40 aspect-[16/9]">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === "vi" ? "Ảnh đã chọn" : "Photo selected"}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-brand-500/50 rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02] hover:bg-brand-500/[0.04] transition-all group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-brand-500/10 text-slate-400 group-hover:text-brand-400 flex items-center justify-center mx-auto transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-200">
                  {t("nutrition.uploadHint")}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  JPG, PNG, WebP (Tối đa 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Optional Macros row */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {language === "vi"
                ? "Ước tính dinh dưỡng (Tùy chọn)"
                : "Nutritional Estimates (Optional)"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">
                  {t("nutrition.calories")}
                </span>
                <input
                  type="number"
                  min="0"
                  value={formCalories}
                  onChange={(e) => setFormCalories(e.target.value)}
                  placeholder="kcal"
                  className="w-full px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">
                  {t("nutrition.protein")}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formProtein}
                  onChange={(e) => setFormProtein(e.target.value)}
                  placeholder="gam"
                  className="w-full px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">
                  {t("nutrition.carbs")}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formCarbs}
                  onChange={(e) => setFormCarbs(e.target.value)}
                  placeholder="gam"
                  className="w-full px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">
                  {t("nutrition.fat")}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formFat}
                  onChange={(e) => setFormFat(e.target.value)}
                  placeholder="gam"
                  className="w-full px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Description & Reflections */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t("nutrition.notes")}
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder={t("nutrition.notesPlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting || !formTitle.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Full-Screen Image Preview Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setViewingImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingImage.url}
              alt={viewingImage.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-3 text-center">
              <span className="text-xs text-brand-400 font-semibold uppercase tracking-wider">
                {viewingImage.mealType}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {viewingImage.title}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title={t("common.confirm")}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              {t("nutrition.deleteConfirm")}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleDeleteMeal(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-colors"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
