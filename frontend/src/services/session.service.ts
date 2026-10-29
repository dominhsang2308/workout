import { WorkoutSession } from "../types";
import { localStore } from "./localStore";

export const sessionService = {
  async getSessions(skip = 0, limit = 50): Promise<WorkoutSession[]> {
    const all = localStore.getSessions();
    return all.slice(skip, skip + limit);
  },

  async getSessionById(id: number): Promise<WorkoutSession> {
    const session = localStore.getSessionById(id);
    if (!session) throw new Error("Session not found");
    return session;
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
    return localStore.createSession(data);
  },

  async updateSession(
    id: number,
    data: Partial<WorkoutSession>
  ): Promise<WorkoutSession> {
    return localStore.updateSession(id, data);
  },

  async deleteSession(id: number): Promise<{ message: string }> {
    localStore.deleteSession(id);
    return { message: "Deleted successfully" };
  },
};
