import api from "./api";
import { AuthResponse, User } from "../types";

export const authService = {
  async register(data: {
    email: string;
    username: string;
    full_name?: string;
    password: string;
  }): Promise<User> {
    const res = await api.post<User>("/auth/register", data);
    return res.data;
  },

  async login(data: {
    username_or_email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login/json", data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>("/users/me");
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("token");
    }
  },
};

