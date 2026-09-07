import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Home as HomeIcon,
  MessageSquare,
  BarChart2,
  Upload as UploadIcon,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo1.png";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { path: "/home", label: "Home", icon: HomeIcon },
    { path: "/assistant", label: "AI Voice Assistant", icon: MessageSquare },
    { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { path: "/upload", label: "Upload Records", icon: UploadIcon },
    { path: "/history", label: "History", icon: Clock },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          to="/home"
          className="flex min-w-0 items-center gap-3 text-primary transition hover:opacity-90"
        >
          <img src={logo} alt="Healthcare AI Logo" className="h-9 w-9 shrink-0 object-contain" />
          <div className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight text-foreground sm:text-base">
              RuralCare AI
            </span>
            <span className="hidden truncate text-[11px] font-medium text-primary sm:block">
              Healthcare Communication Assistant
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-xl border border-border bg-secondary p-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.path ||
              (link.path === "/assistant" && location.pathname === "/chat");

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-white text-primary shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-white hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-lg border border-primary/20 bg-primary-light px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-light sm:flex"
              >
                <User size={13} />
                <span className="max-w-[110px] truncate">{user?.name || user?.email || "User"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-destructive/25 hover:bg-destructive/10 hover:text-destructive"
                title="Sign Out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/25 hover:bg-primary-light hover:text-primary"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

