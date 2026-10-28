import api from "./api";
import { WorkoutSession } from "../types";

export const sessionService = {
  async getSessions(skip = 0, limit = 50): Promise<WorkoutSession[]> {
    const res = await api.get<WorkoutSession[]>("/sessions/", {
      params: { skip, limit },
    });
    return res.data;
  },

  async getSessionById(id: number): Promise<WorkoutSession> {
    const res = await api.get<WorkoutSession>(`/sessions/${id}`);
    return res.data;
  },

  async createSession(data: {
    title: string;
    plan_id?: number | null;
    started_at: string;
    completed_at?: string;
    duration_seconds: number;
    notes?: string;
    sets: Array<{
      exercise_id: number;
      set_number: number;
      reps: number;
      weight_kg: number;
      duration_seconds?: number | null;
      rpe?: number | null;
      is_completed: boolean;
      notes?: string | null;
    }>;
  }): Promise<WorkoutSession> {
    const res = await api.post<WorkoutSession>("/sessions/", data);
    return res.data;
  },

  async updateSession(
    id: number,
    data: Partial<WorkoutSession>
  ): Promise<WorkoutSession> {
    const res = await api.put<WorkoutSession>(`/sessions/${id}`, data);
    return res.data;
  },

  async deleteSession(id: number): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/sessions/${id}`);
    return res.data;
  },
};
