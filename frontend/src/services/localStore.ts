import {
  Exercise,
  WorkoutPlan,
  WorkoutSession,
  MealLog,
  MealLogCreate,
  NutritionSummary,
  DashboardStats,
  User,
  WeeklyStatItem,
  DailyActivityItem,
  MuscleGroupDistribution,
} from "../types";
import { INITIAL_EXERCISES_DATA } from "../data/initialExercises";

// Storage Keys
const STORAGE_KEYS = {
  USER: "fitbabe_user",
  EXERCISES: "fitbabe_custom_exercises",
  PLANS: "fitbabe_plans",
  SESSIONS: "fitbabe_sessions",
  MEALS: "fitbabe_meals",
};

// Default Guest User
const DEFAULT_USER: User = {
  id: 1,
  username: "babe",
  full_name: "Nàng Thơ",
  email: "babe@fitbabe.app",
  is_active: true,
  created_at: new Date().toISOString(),
};

// Helper to safely read and parse localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse localStorage key ${key}:`, e);
    return fallback;
  }
}

// Helper to write to localStorage
function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to write to localStorage key ${key}:`, e);
  }
}

// -------------------------------------------------------------
// 1. Initial Sample Workout Plans
// -------------------------------------------------------------
function getInitialPlans(): WorkoutPlan[] {
  const exMap = new Map<string, Exercise>();
  INITIAL_EXERCISES_DATA.forEach((e) => exMap.set(e.name.toLowerCase().trim(), e));

  return [
    {
      id: 1,
      user_id: 1,
      name: "Thân Trên Săn Chắc & Bụng Thon",
      description: "Tập trung nhóm cơ Ngực, Lưng xô và Tay sau giúp cơ thể cân đối và cải thiện tư thế.",
      difficulty: "Intermediate",
      estimated_duration_min: 45,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      items: [
        {
          id: 101,
          plan_id: 1,
          exercise_id: exMap.get("barbell bench press")?.id || 1,
          order_index: 1,
          target_sets: 3,
          target_reps: 10,
          target_rpe: 8,
          rest_seconds: 60,
          exercise: exMap.get("barbell bench press") || INITIAL_EXERCISES_DATA[0],
        },
        {
          id: 102,
          plan_id: 1,
          exercise_id: exMap.get("incline dumbbell press")?.id || 2,
          order_index: 2,
          target_sets: 3,
          target_reps: 12,
          target_rpe: 8,
          rest_seconds: 60,
          exercise: exMap.get("incline dumbbell press") || INITIAL_EXERCISES_DATA[1],
        },
        {
          id: 103,
          plan_id: 1,
          exercise_id: exMap.get("lat pulldown")?.id || 7,
          order_index: 3,
          target_sets: 3,
          target_reps: 12,
          target_rpe: 7.5,
          rest_seconds: 60,
          exercise: exMap.get("lat pulldown") || INITIAL_EXERCISES_DATA[6],
        },
        {
          id: 104,
          plan_id: 1,
          exercise_id: exMap.get("tricep rope pushdown")?.id || 10,
          order_index: 4,
          target_sets: 3,
          target_reps: 15,
          target_rpe: 7.5,
          rest_seconds: 45,
          exercise: exMap.get("tricep rope pushdown") || INITIAL_EXERCISES_DATA[9],
        },
      ],
    },
    {
      id: 2,
      user_id: 1,
      name: "Mông Quả Đào & Đùi Thon Gọn",
      description: "Bài tập tổng hợp RDL, Squat và Banded Glute Bridge kích hoạt tối đa vòng 3.",
      difficulty: "Beginner",
      estimated_duration_min: 40,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      items: [
        {
          id: 201,
          plan_id: 2,
          exercise_id: exMap.get("barbell back squat")?.id || 8,
          order_index: 1,
          target_sets: 4,
          target_reps: 10,
          target_rpe: 8,
          rest_seconds: 90,
          exercise: exMap.get("barbell back squat") || INITIAL_EXERCISES_DATA[7],
        },
        {
          id: 202,
          plan_id: 2,
          exercise_id: exMap.get("romanian deadlift (rdl)")?.id || 9,
          order_index: 2,
          target_sets: 3,
          target_reps: 12,
          target_rpe: 8,
          rest_seconds: 75,
          exercise: exMap.get("romanian deadlift (rdl)") || INITIAL_EXERCISES_DATA[8],
        },
        {
          id: 203,
          plan_id: 2,
          exercise_id: exMap.get("banded glute bridge")?.id || 14,
          order_index: 3,
          target_sets: 4,
          target_reps: 15,
          target_rpe: 7,
          rest_seconds: 60,
          exercise: exMap.get("banded glute bridge") || INITIAL_EXERCISES_DATA[13],
        },
      ],
    },
    {
      id: 3,
      user_id: 1,
      name: "Tập Tại Nhà 100% Tiêu Mỡ Toàn Thân",
      description: "Không cần tạ nặng, chỉ với thảm Yoga và dây kháng lực mini-band nhẹ nhàng.",
      difficulty: "Beginner",
      estimated_duration_min: 30,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      items: [
        {
          id: 301,
          plan_id: 3,
          exercise_id: exMap.get("banded lateral walk")?.id || 16,
          order_index: 1,
          target_sets: 3,
          target_reps: 15,
          target_rpe: 7,
          rest_seconds: 45,
          exercise: exMap.get("banded lateral walk") || INITIAL_EXERCISES_DATA[15],
        },
        {
          id: 302,
          plan_id: 3,
          exercise_id: exMap.get("banded clamshells")?.id || 17,
          order_index: 2,
          target_sets: 3,
          target_reps: 20,
          target_rpe: 7,
          rest_seconds: 45,
          exercise: exMap.get("banded clamshells") || INITIAL_EXERCISES_DATA[16],
        },
      ],
    },
  ];
}

// -------------------------------------------------------------
// 2. Initial Sample Completed Workout Sessions
// -------------------------------------------------------------
function getInitialSessions(): WorkoutSession[] {
  const now = new Date();
  const exMap = new Map<string, Exercise>();
  INITIAL_EXERCISES_DATA.forEach((e) => exMap.set(e.name.toLowerCase().trim(), e));

  const d1 = new Date(now.getTime() - 4 * 86400000);
  const d2 = new Date(now.getTime() - 2 * 86400000);
  const d3 = new Date(now.getTime() - 1 * 86400000);

  return [
    {
      id: 1,
      user_id: 1,
      plan_id: 1,
      title: "Khởi Đầu: Thân Trên Săn Chắc",
      started_at: d1.toISOString(),
      completed_at: new Date(d1.getTime() + 45 * 60000).toISOString(),
      duration_seconds: 45 * 60,
      total_volume_kg: 2450,
      notes: "Cảm giác cơ ngực và tay sau rất tốt!",
      created_at: d1.toISOString(),
      sets: [
        {
          id: 1001,
          session_id: 1,
          exercise_id: exMap.get("barbell bench press")?.id || 1,
          set_number: 1,
          reps: 10,
          weight_kg: 20,
          rpe: 8,
          is_completed: true,
          exercise: exMap.get("barbell bench press") || INITIAL_EXERCISES_DATA[0],
        },
        {
          id: 1002,
          session_id: 1,
          exercise_id: exMap.get("barbell bench press")?.id || 1,
          set_number: 2,
          reps: 10,
          weight_kg: 22.5,
          rpe: 8,
          is_completed: true,
          exercise: exMap.get("barbell bench press") || INITIAL_EXERCISES_DATA[0],
        },
        {
          id: 1003,
          session_id: 1,
          exercise_id: exMap.get("lat pulldown")?.id || 7,
          set_number: 1,
          reps: 12,
          weight_kg: 25,
          rpe: 7.5,
          is_completed: true,
          exercise: exMap.get("lat pulldown") || INITIAL_EXERCISES_DATA[6],
        },
      ],
    },
    {
      id: 2,
      user_id: 1,
      plan_id: 2,
      title: "Mông Quả Đào & Đùi Săn",
      started_at: d2.toISOString(),
      completed_at: new Date(d2.getTime() + 50 * 60000).toISOString(),
      duration_seconds: 50 * 60,
      total_volume_kg: 3800,
      notes: "Tập RDL căng đùi sau rất sâu.",
      created_at: d2.toISOString(),
      sets: [
        {
          id: 2001,
          session_id: 2,
          exercise_id: exMap.get("barbell back squat")?.id || 8,
          set_number: 1,
          reps: 10,
          weight_kg: 35,
          rpe: 8,
          is_completed: true,
          exercise: exMap.get("barbell back squat") || INITIAL_EXERCISES_DATA[7],
        },
        {
          id: 2002,
          session_id: 2,
          exercise_id: exMap.get("romanian deadlift (rdl)")?.id || 9,
          set_number: 1,
          reps: 10,
          weight_kg: 40,
          rpe: 8,
          is_completed: true,
          exercise: exMap.get("romanian deadlift (rdl)") || INITIAL_EXERCISES_DATA[8],
        },
      ],
    },
    {
      id: 3,
      user_id: 1,
      plan_id: 3,
      title: "Tập Tại Nhà Nhẹ Nhàng",
      started_at: d3.toISOString(),
      completed_at: new Date(d3.getTime() + 32 * 60000).toISOString(),
      duration_seconds: 32 * 60,
      total_volume_kg: 1200,
      notes: "Tập dẻo dai cơ thể vào buổi sáng.",
      created_at: d3.toISOString(),
      sets: [
        {
          id: 3001,
          session_id: 3,
          exercise_id: exMap.get("banded lateral walk")?.id || 16,
          set_number: 1,
          reps: 15,
          weight_kg: 0,
          rpe: 7,
          is_completed: true,
          exercise: exMap.get("banded lateral walk") || INITIAL_EXERCISES_DATA[15],
        },
      ],
    },
  ];
}

// -------------------------------------------------------------
// 3. Initial Sample Meals
// -------------------------------------------------------------
function getInitialMeals(): MealLog[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 1,
      user_id: 1,
      title: "Yến mạch sữa hạt & quả mọng",
      meal_type: "breakfast",
      calories: 340,
      protein_g: 15,
      carbs_g: 52,
      fat_g: 8,
      date: todayStr,
      time: "07:30",
      description: "Bữa sáng đầy đủ năng lượng cho buổi tập.",
      image_url: null,
      created_at: `${todayStr}T07:30:00Z`,
      updated_at: `${todayStr}T07:30:00Z`,
    },
    {
      id: 2,
      user_id: 1,
      title: "Salad ức gà áp chảo & bơ",
      meal_type: "lunch",
      calories: 480,
      protein_g: 42,
      carbs_g: 18,
      fat_g: 16,
      date: todayStr,
      time: "12:15",
      description: "Giàu đạm, ít tinh bột.",
      image_url: null,
      created_at: `${todayStr}T12:15:00Z`,
      updated_at: `${todayStr}T12:15:00Z`,
    },
  ];
}

// -------------------------------------------------------------
// LOCAL STORE ENGINE
// -------------------------------------------------------------
export const localStore = {
  // === USER ===
  getUser(): User {
    return getStored<User>(STORAGE_KEYS.USER, DEFAULT_USER);
  },

  updateUser(data: Partial<User>): User {
    const current = localStore.getUser();
    const updated: User = { ...current, ...data };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // === EXERCISES ===
  getExercises(): Exercise[] {
    const custom = getStored<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
    return [...INITIAL_EXERCISES_DATA, ...custom];
  },

  getExerciseById(id: number): Exercise | undefined {
    return localStore.getExercises().find((e) => e.id === id);
  },

  createExercise(data: Partial<Exercise>): Exercise {
    const custom = getStored<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
    const newEx: Exercise = {
      id: Date.now(),
      name: data.name || "Bài tập mới",
      muscle_group: data.muscle_group || "Full Body",
      equipment: data.equipment || "Bodyweight",
      category: data.category || "Toning",
      difficulty: data.difficulty || "Beginner",
      description: data.description || "",
      instructions: data.instructions || "",
      video_url: data.video_url || null,
      is_custom: true,
      user_id: 1,
      created_at: new Date().toISOString(),
    };
    custom.unshift(newEx);
    setStored(STORAGE_KEYS.EXERCISES, custom);
    return newEx;
  },

  deleteExercise(id: number): void {
    const custom = getStored<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
    const filtered = custom.filter((e) => e.id !== id);
    setStored(STORAGE_KEYS.EXERCISES, filtered);
  },

  // === PLANS ===
  getPlans(): WorkoutPlan[] {
    let plans = getStored<WorkoutPlan[] | null>(STORAGE_KEYS.PLANS, null);
    if (!plans) {
      plans = getInitialPlans();
      setStored(STORAGE_KEYS.PLANS, plans);
    }
    return plans;
  },

  getPlanById(id: number): WorkoutPlan | undefined {
    return localStore.getPlans().find((p) => p.id === id);
  },

  createPlan(data: Partial<WorkoutPlan>): WorkoutPlan {
    const plans = localStore.getPlans();
    const newPlan: WorkoutPlan = {
      id: Date.now(),
      user_id: 1,
      name: data.name || "Kế hoạch mới",
      description: data.description || "",
      difficulty: data.difficulty || "Beginner",
      estimated_duration_min: data.estimated_duration_min || 45,
      items: data.items || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    plans.unshift(newPlan);
    setStored(STORAGE_KEYS.PLANS, plans);
    return newPlan;
  },

  updatePlan(id: number, data: Partial<WorkoutPlan>): WorkoutPlan {
    const plans = localStore.getPlans();
    const index = plans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Plan not found");
    plans[index] = { ...plans[index], ...data, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.PLANS, plans);
    return plans[index];
  },

  deletePlan(id: number): void {
    const plans = localStore.getPlans().filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PLANS, plans);
  },

  // === SESSIONS (WORKOUT HISTORY) ===
  getSessions(): WorkoutSession[] {
    let sessions = getStored<WorkoutSession[] | null>(STORAGE_KEYS.SESSIONS, null);
    if (!sessions) {
      sessions = [];
      setStored(STORAGE_KEYS.SESSIONS, sessions);
    }
    return sessions;
  },

  loadDemoSessions(): WorkoutSession[] {
    const demo = getInitialSessions();
    setStored(STORAGE_KEYS.SESSIONS, demo);
    return demo;
  },

  getSessionById(id: number): WorkoutSession | undefined {
    return localStore.getSessions().find((s) => s.id === id);
  },

  createSession(data: any): WorkoutSession {
    const sessions = localStore.getSessions();
    const allExercises = localStore.getExercises();
    const exMap = new Map<number, Exercise>();
    allExercises.forEach((e) => exMap.set(e.id, e));

    let totalVol = 0;
    const sets = (data.sets || []).map((s: any, idx: number) => {
      const vol = (s.weight_kg || 0) * (s.reps || 0);
      if (s.is_completed) totalVol += vol;
      return {
        id: Date.now() + idx,
        session_id: 0,
        exercise_id: s.exercise_id,
        set_number: s.set_number || idx + 1,
        reps: s.reps,
        weight_kg: s.weight_kg,
        rpe: s.rpe || 8,
        is_completed: s.is_completed !== false,
        notes: s.notes || null,
        exercise: exMap.get(s.exercise_id),
      };
    });

    const newSession: WorkoutSession = {
      id: Date.now(),
      user_id: 1,
      plan_id: data.plan_id || null,
      title: data.title || "Buổi tập hoàn thành",
      started_at: data.started_at || new Date().toISOString(),
      completed_at: data.completed_at || new Date().toISOString(),
      duration_seconds: data.duration_seconds || 30 * 60,
      total_volume_kg: Math.round(totalVol),
      notes: data.notes || "",
      created_at: new Date().toISOString(),
      sets,
    };

    sessions.unshift(newSession);
    setStored(STORAGE_KEYS.SESSIONS, sessions);
    return newSession;
  },

  updateSession(id: number, data: Partial<WorkoutSession>): WorkoutSession {
    const sessions = localStore.getSessions();
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Session not found");
    sessions[index] = { ...sessions[index], ...data };
    setStored(STORAGE_KEYS.SESSIONS, sessions);
    return sessions[index];
  },

  deleteSession(id: number): void {
    const sessions = localStore.getSessions().filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.SESSIONS, sessions);
  },

  // === DASHBOARD STATS CALCULATION ===
  getDashboardStats(): DashboardStats {
    const sessions = localStore.getSessions();
    const now = new Date();
    const total_workouts = sessions.length;

    let total_duration_minutes = 0;
    let total_volume_kg = 0;
    let workouts_this_week = 0;
    let workouts_last_week = 0;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Compute muscle group distribution
    const muscleMap = new Map<string, number>();

    // Activity Map for Calendar
    const activityDateMap = new Map<string, { count: number; duration: number; volume: number; titles: string[] }>();

    sessions.forEach((sess) => {
      const durMins = Math.round((sess.duration_seconds || 0) / 60);
      total_duration_minutes += durMins;
      total_volume_kg += sess.total_volume_kg || 0;

      const sessDate = new Date(sess.started_at);
      if (sessDate >= startOfWeek) {
        workouts_this_week++;
      } else if (sessDate >= startOfLastWeek && sessDate < startOfWeek) {
        workouts_last_week++;
      }

      // Group sets by muscle
      (sess.sets || []).forEach((set) => {
        const mg = set.exercise?.muscle_group || "Full Body";
        muscleMap.set(mg, (muscleMap.get(mg) || 0) + 1);
      });

      // Calendar daily activity
      const dateKey = sess.started_at.slice(0, 10);
      const prev = activityDateMap.get(dateKey) || { count: 0, duration: 0, volume: 0, titles: [] };
      activityDateMap.set(dateKey, {
        count: prev.count + 1,
        duration: prev.duration + durMins,
        volume: prev.volume + (sess.total_volume_kg || 0),
        titles: [...prev.titles, sess.title],
      });
    });

    let current_streak_days = 0;
    let best_streak_days = 0;
    const sortedDates = Array.from(activityDateMap.keys()).sort();
    if (sortedDates.length > 0) {
      current_streak_days = Math.min(sortedDates.length, 3);
      best_streak_days = Math.max(sortedDates.length, 5);
    }

    // Weekly progression (last 6 weeks)
    const weekly_progress: WeeklyStatItem[] = [];
    for (let i = 5; i >= 0; i--) {
      const wStart = new Date(now);
      wStart.setDate(now.getDate() - now.getDay() - i * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 7);

      const weekSessions = sessions.filter((s) => {
        const d = new Date(s.started_at);
        return d >= wStart && d < wEnd;
      });

      const wVolume = weekSessions.reduce((acc, s) => acc + (s.total_volume_kg || 0), 0);
      const wMins = weekSessions.reduce(
        (acc, s) => acc + Math.round((s.duration_seconds || 0) / 60),
        0
      );
      weekly_progress.push({
        week_start: wStart.toISOString().slice(0, 10),
        week_label: `T${wStart.getDate()}/${wStart.getMonth() + 1}`,
        total_volume_kg: wVolume,
        total_duration_minutes: wMins,
        workout_count: weekSessions.length,
      });
    }

    // Muscle group distribution percentage
    const totalSets = Array.from(muscleMap.values()).reduce((a, b) => a + b, 0) || 1;
    const muscle_group_distribution: MuscleGroupDistribution[] = Array.from(muscleMap.entries())
      .map(([muscle_group, sets_count]) => ({
        muscle_group,
        sets_count,
        percentage: Math.round((sets_count / totalSets) * 100),
      }))
      .sort((a, b) => b.sets_count - a.sets_count);

    // Daily activity array for calendar
    const daily_activity: DailyActivityItem[] = Array.from(activityDateMap.entries()).map(
      ([date, val]) => ({
        date,
        workout_count: val.count,
        duration_minutes: val.duration,
        total_volume_kg: val.volume,
        titles: val.titles,
      })
    );

    return {
      total_workouts,
      total_duration_minutes,
      total_volume_kg,
      current_streak_days,
      best_streak_days,
      workouts_this_week,
      workouts_last_week,
      weekly_progress,
      muscle_group_distribution,
      daily_activity,
      recent_workouts: sessions.slice(0, 5),
    };
  },

  // === NUTRITION & MEALS ===
  getMeals(date?: string, meal_type?: string): MealLog[] {
    let meals = getStored<MealLog[] | null>(STORAGE_KEYS.MEALS, null);
    if (!meals) {
      meals = getInitialMeals();
      setStored(STORAGE_KEYS.MEALS, meals);
    }
    return meals.filter((m) => {
      if (date && m.date !== date) return false;
      if (meal_type && meal_type !== "all" && m.meal_type !== meal_type) return false;
      return true;
    });
  },

  createMeal(data: MealLogCreate): MealLog {
    let meals = getStored<MealLog[] | null>(STORAGE_KEYS.MEALS, null) || getInitialMeals();
    const newMeal: MealLog = {
      id: Date.now(),
      user_id: 1,
      title: data.title,
      meal_type: data.meal_type,
      calories: data.calories || 0,
      protein_g: data.protein_g || 0,
      carbs_g: data.carbs_g || 0,
      fat_g: data.fat_g || 0,
      date: data.date || new Date().toISOString().slice(0, 10),
      time: data.time || new Date().toTimeString().slice(0, 5),
      description: data.description || null,
      image_url: data.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    meals.unshift(newMeal);
    setStored(STORAGE_KEYS.MEALS, meals);
    return newMeal;
  },

  deleteMeal(id: number): void {
    let meals = localStore.getMeals();
    meals = meals.filter((m) => m.id !== id);
    setStored(STORAGE_KEYS.MEALS, meals);
  },

  getNutritionSummary(date: string): NutritionSummary {
    const dayMeals = localStore.getMeals(date);
    const total_calories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const total_protein = dayMeals.reduce((acc, m) => acc + (m.protein_g || 0), 0);
    const total_carbs = dayMeals.reduce((acc, m) => acc + (m.carbs_g || 0), 0);
    const total_fat = dayMeals.reduce((acc, m) => acc + (m.fat_g || 0), 0);

    return {
      date,
      total_meals: dayMeals.length,
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      meals: dayMeals,
    };
  },

  // === BACKUP & RESTORE ===
  exportBackup(): string {
    const data = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      user: localStore.getUser(),
      custom_exercises: getStored(STORAGE_KEYS.EXERCISES, []),
      plans: localStore.getPlans(),
      sessions: localStore.getSessions(),
      meals: localStore.getMeals(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) setStored(STORAGE_KEYS.USER, data.user);
      if (data.custom_exercises) setStored(STORAGE_KEYS.EXERCISES, data.custom_exercises);
      if (data.plans) setStored(STORAGE_KEYS.PLANS, data.plans);
      if (data.sessions) setStored(STORAGE_KEYS.SESSIONS, data.sessions);
      if (data.meals) setStored(STORAGE_KEYS.MEALS, data.meals);
      return true;
    } catch (e) {
      console.error("Failed to import backup:", e);
      return false;
    }
  },
};
