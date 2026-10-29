import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";

// Route-based code splitting for ultra-fast initial page loads
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("./pages/Register").then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Exercises = lazy(() => import("./pages/Exercises").then((m) => ({ default: m.Exercises })));
const WorkoutPlans = lazy(() => import("./pages/WorkoutPlans").then((m) => ({ default: m.WorkoutPlans })));
const ActiveWorkout = lazy(() => import("./pages/ActiveWorkout").then((m) => ({ default: m.ActiveWorkout })));
const WorkoutHistory = lazy(() => import("./pages/WorkoutHistory").then((m) => ({ default: m.WorkoutHistory })));
const Nutrition = lazy(() => import("./pages/Nutrition").then((m) => ({ default: m.Nutrition })));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0a15] overflow-x-hidden">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-full pb-28 md:pb-8">
          {children}
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppLayout>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/exercises"
                element={
                  <ProtectedRoute>
                    <Exercises />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/plans"
                element={
                  <ProtectedRoute>
                    <WorkoutPlans />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/active-workout"
                element={
                  <ProtectedRoute>
                    <ActiveWorkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <WorkoutHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/nutrition"
                element={
                  <ProtectedRoute>
                    <Nutrition />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
