import { Toaster } from "react-hot-toast";

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import OAuthCallback from "./components/OAuthCallback.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/Dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      />
    </div>
  );
}

export default App;
