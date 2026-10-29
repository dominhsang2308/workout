import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { localStore } from "../services/localStore";

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
  updateProfile: (data: { full_name?: string; username?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Offline-first guest profile: always authenticated, 0ms loading!
  const [user, setUser] = useState<User>(() => localStore.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    const localUser = localStore.getUser();
    setUser(localUser);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    // No-op for offline mode: always logged in!
    setIsLoading(false);
  };

  const register = async () => {
    // No-op for offline mode: always logged in!
    setIsLoading(false);
  };

  const logout = async () => {
    // In local mode, logout can reset to default profile if desired
    localStore.updateUser({ full_name: "Gabriel", username: "gabriel" });
    setUser(localStore.getUser());
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateProfile = (data: { full_name?: string; username?: string }) => {
    const updated = localStore.updateUser(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
