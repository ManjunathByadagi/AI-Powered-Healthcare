import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Pages
import LandingPage from "./pages/landing/LandingPage";
import Home from "@/pages/home/Home";
import History from "./pages/history/History";
import PrescriptionDetails from "./pages/history/PrescriptionDetails";
import Upload from "./pages/upload/Upload";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Profile from "./pages/profile/Profile";
import Assistant from "./pages/assistant/Assistant";

// Contexts
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Main application Navbar
import Navbar from "@/components/layout/Navbar";

// Results / OCR
import { Workspace } from "@/components/healthcare/Workspace";
import { AppHeader } from "@/components/healthcare/AppHeader";


// ============================================================
// RESULTS PAGE
// ============================================================

function ResultsPage() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <AppHeader />
      <Workspace />
    </div>
  );
}


// ============================================================
// APPLICATION CONTENT
// ============================================================

function AppContent() {
  const location = useLocation();

  /*
   * These pages should NOT display the main application Navbar.
   *
   * Landing page has its own design.
   * Authentication pages have their own auth layout.
   */
  const noNavbarPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const hideNavbar = noNavbarPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Main application Navbar */}
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ==================================================
            LANDING PAGE
           ================================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* ==================================================
            AUTHENTICATION
           ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ==================================================
            MAIN APPLICATION
           ================================================== */}

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<ResultsPage />}
        />

        <Route
          path="/results"
          element={<ResultsPage />}
        />


        {/* ==================================================
            MEDICAL RECORDS
           ================================================== */}

        <Route
          path="/upload"
          element={<Upload />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/prescription/:id"
          element={<PrescriptionDetails />}
        />


        {/* ==================================================
            USER PROFILE
           ================================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ==================================================
            AI ASSISTANT
           ================================================== */}

        <Route
          path="/assistant"
          element={<Assistant />}
        />

        <Route
          path="/chat"
          element={
            <Navigate
              to="/assistant"
              replace
            />
          }
        />


        {/* ==================================================
            UNKNOWN ROUTES
           ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </div>
  );
}


// ============================================================
// ROOT APPLICATION
// ============================================================

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}