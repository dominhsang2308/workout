import { Exercise } from "../types";
import { localStore } from "./localStore";

export const exerciseService = {
  async getExercises(params?: {
    muscle_group?: string;
    equipment?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Exercise[]> {
    let exercises = localStore.getExercises();

    if (params) {
      if (params.muscle_group && params.muscle_group !== "All") {
        exercises = exercises.filter(
          (e) => e.muscle_group.toLowerCase() === params.muscle_group!.toLowerCase()
        );
      }
      if (params.equipment && params.equipment !== "All") {
        exercises = exercises.filter(
          (e) => e.equipment.toLowerCase() === params.equipment!.toLowerCase()
        );
      }
      if (params.difficulty && params.difficulty !== "All") {
        exercises = exercises.filter(
          (e) => e.difficulty?.toLowerCase() === params.difficulty!.toLowerCase()
        );
      }
      if (params.search && params.search.trim()) {
        const q = params.search.trim().toLowerCase();
        exercises = exercises.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.muscle_group.toLowerCase().includes(q) ||
            e.equipment.toLowerCase().includes(q)
        );
      }
    }

    return exercises;
  },

  clearCache() {
    // No-op for localStore
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const ex = localStore.getExerciseById(id);
    if (!ex) throw new Error("Exercise not found");
    return ex;
  },

  async createExercise(data: Partial<Exercise>): Promise<Exercise> {
    return localStore.createExercise(data);
  },

  async updateExercise(id: number, data: Partial<Exercise>): Promise<Exercise> {
    // Return existing or updated
    const ex = localStore.getExerciseById(id);
    return ex ? { ...ex, ...data } : localStore.createExercise(data);
  },

  async deleteExercise(id: number): Promise<{ message: string }> {
    localStore.deleteExercise(id);
    return { message: "Deleted successfully" };
  },
};
