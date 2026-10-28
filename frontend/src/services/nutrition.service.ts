import api from "./api";
import { MealLog, MealLogCreate, NutritionSummary } from "../types";

export const getFullImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendBase = (
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
  ).replace("/api/v1", "");
  return `${backendBase}${url}`;
};

export const nutritionService = {
  async getMeals(date?: string, meal_type?: string): Promise<MealLog[]> {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (meal_type && meal_type !== "all") params.meal_type = meal_type;

    const response = await api.get<MealLog[]>("/nutrition/meals", { params });
    return response.data;
  },

  async createMeal(data: MealLogCreate): Promise<MealLog> {
    const response = await api.post<MealLog>("/nutrition/meals", data);
    return response.data;
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ image_url: string }>(
      "/nutrition/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.image_url;
  },

  async deleteMeal(id: number): Promise<void> {
    await api.delete(`/nutrition/meals/${id}`);
  },

  async getSummary(date: string): Promise<NutritionSummary> {
    const response = await api.get<NutritionSummary>("/nutrition/summary", {
      params: { date },
    });
    return response.data;
  },
};
