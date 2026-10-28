import api from "./api";
import { Exercise } from "../types";

let cachedAllExercises: Exercise[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60s cache

export const exerciseService = {
  async getExercises(params?: {
    muscle_group?: string;
    equipment?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Exercise[]> {
    const isUnfiltered =
      !params ||
      (Object.keys(params).length === 0 ||
        Object.values(params).every((v) => !v || v === "All"));

    const now = Date.now();
    if (isUnfiltered && cachedAllExercises && now - cacheTime < CACHE_TTL_MS) {
      return cachedAllExercises;
    }

    const res = await api.get<Exercise[]>("/exercises/", { params });

    if (isUnfiltered) {
      cachedAllExercises = res.data;
      cacheTime = now;
    }
    return res.data;
  },

  clearCache() {
    cachedAllExercises = null;
    cacheTime = 0;
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const res = await api.get<Exercise>(`/exercises/${id}`);
    return res.data;
  },

  async createExercise(data: Partial<Exercise>): Promise<Exercise> {
    const res = await api.post<Exercise>("/exercises/", data);
    exerciseService.clearCache();
    return res.data;
  },

  async updateExercise(id: number, data: Partial<Exercise>): Promise<Exercise> {
    const res = await api.put<Exercise>(`/exercises/${id}`, data);
    exerciseService.clearCache();
    return res.data;
  },

  async deleteExercise(id: number): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/exercises/${id}`);
    exerciseService.clearCache();
    return res.data;
  },
};
