import api from "./api";
import { DashboardStats } from "../types";

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>("/stats/dashboard");
    return res.data;
  },
};
