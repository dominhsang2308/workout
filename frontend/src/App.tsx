import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LoadingSpinner } from "./components/LoadingSpinner";

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
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        message={
          language === "vi"
            ? "Đang kết nối tài khoản..."
            : "Authenticating..."
        }
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0a15]">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          {children}
        </main>
      </div>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

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
