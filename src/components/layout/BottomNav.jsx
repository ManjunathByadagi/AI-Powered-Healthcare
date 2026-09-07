import {
  House,
  Bot,
  BarChart2,
  Upload,
  History,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", icon: House, path: "/home" },
  { name: "AI Bot", icon: Bot, path: "/assistant" },
  { name: "Metrics", icon: BarChart2, path: "/dashboard" },
  { name: "Upload", icon: Upload, path: "/upload" },
  { name: "History", icon: History, path: "/history" },
  { name: "Profile", icon: User, path: "/profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-2 left-1/2 z-50 w-[calc(100%-1rem)] max-w-lg -translate-x-1/2 md:hidden">
      <div className="flex items-center justify-around rounded-2xl border border-border bg-white/95 px-1.5 py-1.5 shadow-floating backdrop-blur">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 text-[10px] font-semibold transition ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Icon size={17} />
              <span className="mt-1 leading-none">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

