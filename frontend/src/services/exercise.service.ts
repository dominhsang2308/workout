import api from "./api";
import { Exercise } from "../types";

export const exerciseService = {
  async getExercises(params?: {
    muscle_group?: string;
    equipment?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Exercise[]> {
    const res = await api.get<Exercise[]>("/exercises/", { params });
    return res.data;
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const res = await api.get<Exercise>(`/exercises/${id}`);
    return res.data;
  },

  async createExercise(data: Partial<Exercise>): Promise<Exercise> {
    const res = await api.post<Exercise>("/exercises/", data);
    return res.data;
  },

  async updateExercise(id: number, data: Partial<Exercise>): Promise<Exercise> {
    const res = await api.put<Exercise>(`/exercises/${id}`, data);
    return res.data;
  },

  async deleteExercise(id: number): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/exercises/${id}`);
    return res.data;
  },
};
