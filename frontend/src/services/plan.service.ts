import { WorkoutPlan } from "../types";
import { localStore } from "./localStore";

export const planService = {
  async getPlans(): Promise<WorkoutPlan[]> {
    return localStore.getPlans();
  },

  async getPlanById(id: number): Promise<WorkoutPlan> {
    const plan = localStore.getPlanById(id);
    if (!plan) throw new Error("Plan not found");
    return plan;
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
    const allExercises = localStore.getExercises();
    const exMap = new Map(allExercises.map((e) => [e.id, e]));

    const populatedItems = (data.items || []).map((item, idx) => ({
      id: Date.now() + idx,
      plan_id: 0,
      exercise_id: item.exercise_id,
      order_index: item.order_index || idx + 1,
      target_sets: item.target_sets,
      target_reps: item.target_reps,
      target_rpe: item.target_rpe || 8,
      rest_seconds: item.rest_seconds || 60,
      notes: item.notes || null,
      exercise: exMap.get(item.exercise_id),
    }));

    return localStore.createPlan({
      ...data,
      items: populatedItems as any,
    });
  },

  async updatePlan(id: number, data: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    return localStore.updatePlan(id, data);
  },

  async deletePlan(id: number): Promise<{ message: string }> {
    localStore.deletePlan(id);
    return { message: "Deleted successfully" };
  },
};
