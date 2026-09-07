import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();
  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "User");

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Welcome back</p>
          <h1 className="mt-1 truncate text-2xl font-semibold text-foreground sm:text-3xl">
            {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your health information, prescriptions, and care guidance in one secure place.
          </p>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary shadow-sm transition hover:border-primary/25 hover:bg-primary-light"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
