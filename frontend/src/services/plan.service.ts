import api from "./api";
import { WorkoutPlan } from "../types";

export const planService = {
  async getPlans(): Promise<WorkoutPlan[]> {
    const res = await api.get<WorkoutPlan[]>("/plans/");
    return res.data;
  },

  async getPlanById(id: number): Promise<WorkoutPlan> {
    const res = await api.get<WorkoutPlan>(`/plans/${id}`);
    return res.data;
  },

  async createPlan(data: {
    name: string;
    description?: string;
    difficulty?: string;
    estimated_duration_min?: number;
    items?: Array<{
      exercise_id: number;
      order_index: number;
      target_sets: number;
      target_reps: number;
      target_rpe?: number;
      rest_seconds: number;
      notes?: string;
    }>;
  }): Promise<WorkoutPlan> {
    const res = await api.post<WorkoutPlan>("/plans/", data);
    return res.data;
  },

  async updatePlan(id: number, data: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    const res = await api.put<WorkoutPlan>(`/plans/${id}`, data);
    return res.data;
  },

  async deletePlan(id: number): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/plans/${id}`);
    return res.data;
  },
};
