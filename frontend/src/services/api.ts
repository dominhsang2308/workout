import axios from "axios";

let rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").trim();
rawUrl = rawUrl.replace(/\/+$/, "");
if (!rawUrl.endsWith("/api/v1")) {
  rawUrl = `${rawUrl}/api/v1`;
}
const API_BASE_URL = rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT Bearer token into all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses, auto-retry on Render cold starts, and handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Auto-retry once on network error or 502/503/504 (Render cold-start spinup)
    if (
      config &&
      !config._retry &&
      (!error.response || [502, 503, 504].includes(error.response?.status))
    ) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return api(config);
    }

    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      const isAuthRequest =
        error.config.url?.includes("/auth/login") ||
        error.config.url?.includes("/auth/register");
      if (!isAuthRequest) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
