import { MealLog, MealLogCreate, NutritionSummary } from "../types";
import { localStore } from "./localStore";

export const getFullImageUrl = (url?: string | null): string => {
  if (!url) return "";
  return url;
};

export const nutritionService = {
  async getMeals(date?: string, meal_type?: string): Promise<MealLog[]> {
    return localStore.getMeals(date, meal_type);
  },

  async createMeal(data: MealLogCreate): Promise<MealLog> {
    return localStore.createMeal(data);
  },

  async uploadImage(file: File): Promise<string> {
    // Convert to base64 Data URL for 100% offline persistence!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async deleteMeal(id: number): Promise<void> {
    localStore.deleteMeal(id);
  },

  async getSummary(date: string): Promise<NutritionSummary> {
    return localStore.getNutritionSummary(date);
  },
};
