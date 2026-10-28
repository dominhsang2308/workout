export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
  category: string;
  difficulty?: "Beginner" | "Intermediate" | "Experienced" | string;
  description?: string | null;
  instructions?: string | null;
  video_url?: string | null;
  is_custom: boolean;
  user_id?: number | null;
  created_at: string;
}

export interface WorkoutPlanItem {
  id?: number;
  plan_id?: number;
  exercise_id: number;
  order_index: number;
  target_sets: number;
  target_reps: number;
  target_rpe?: number | null;
  rest_seconds: number;
  notes?: string | null;
  exercise?: Exercise;
}

export interface WorkoutPlan {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  difficulty: string;
  estimated_duration_min: number;
  created_at: string;
  updated_at?: string | null;
  items: WorkoutPlanItem[];
}

export interface WorkoutSetLog {
  id?: number;
  session_id?: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight_kg: number;
  duration_seconds?: number | null;
  rpe?: number | null;
  is_completed: boolean;
  notes?: string | null;
  exercise?: Exercise;
}

export interface WorkoutSession {
  id: number;
  user_id: number;
  plan_id?: number | null;
  title: string;
  started_at: string;
  completed_at?: string | null;
  duration_seconds: number;
  total_volume_kg: number;
  notes?: string | null;
  created_at: string;
  sets: WorkoutSetLog[];
}

export interface WeeklyStatItem {
  week_start: string;
  week_label: string;
  workout_count: number;
  total_volume_kg: number;
  total_duration_minutes: number;
}

export interface MuscleGroupDistribution {
  muscle_group: string;
  sets_count: number;
  percentage: number;
}

export interface DailyActivityItem {
  date: string;
  workout_count: number;
  duration_minutes: number;
  total_volume_kg: number;
  titles: string[];
}

export interface DashboardStats {
  total_workouts: number;
  total_duration_minutes: number;
  total_volume_kg: number;
  current_streak_days: number;
  best_streak_days: number;
  workouts_this_week: number;
  workouts_last_week: number;
  weekly_progress: WeeklyStatItem[];
  muscle_group_distribution: MuscleGroupDistribution[];
  recent_workouts: WorkoutSession[];
  daily_activity: DailyActivityItem[];
}

export type MealType = "breakfast" | "lunch" | "afternoon_snack" | "dinner" | "snack";

export interface MealLog {
  id: number;
  user_id: number;
  meal_type: MealType;
  title: string;
  description?: string | null;
  image_url?: string | null;
  date: string;
  time?: string | null;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface MealLogCreate {
  meal_type: MealType;
  title: string;
  description?: string;
  image_url?: string;
  date: string;
  time?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface NutritionSummary {
  date: string;
  total_meals: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meals: MealLog[];
}

