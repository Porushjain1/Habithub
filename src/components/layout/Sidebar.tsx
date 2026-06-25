import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Table as TableIcon,
  BarChart2, 
  Calendar, 
  Settings, 
  LogOut,
  Grid,
  Target
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TableIcon, label: "Habit Tracker", path: "/spreadsheet" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Grid, label: "Heatmap", path: "/heatmap" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-full hidden md:flex flex-col border-r border-border glass bg-white/40 dark:bg-black/40 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/10">
          <Target className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">HabitHub</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
