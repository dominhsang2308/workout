import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username_or_email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    full_name?: string
  ) => Promise<void>;
  logout: () => Promise<void> | void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      // 10s maximum timeout to avoid hanging on cold starts
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 10000)
      );
      const userData = await Promise.race([authService.getMe(), timeoutPromise]);
      setUser(userData);
    } catch (err: any) {
      console.warn("Failed to fetch current user profile:", err);
      // Only wipe token if server explicitly rejected with 401 Unauthorized
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username_or_email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ username_or_email, password });
      localStorage.setItem("token", res.access_token);
      await fetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    full_name?: string
  ) => {
    setIsLoading(true);
    try {
      await authService.register({ email, username, password, full_name });
      // Auto-login after registration
      const loginRes = await authService.login({
        username_or_email: username,
        password,
      });
      localStorage.setItem("token", loginRes.access_token);
      await fetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
