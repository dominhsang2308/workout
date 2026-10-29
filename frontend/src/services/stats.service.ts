import { DashboardStats } from "../types";
import { localStore } from "./localStore";

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return localStore.getDashboardStats();
  },
};
