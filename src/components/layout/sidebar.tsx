import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  CircleUser,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Студенты" },
  { to: "/assignments", icon: FileText, label: "Задания" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  isMobile,
  onCloseMobile,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      style={{ width: isMobile ? "280px" : collapsed ? "72px" : "256px" }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isMobile && "shadow-2xl"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-muted px-4">
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span
            className={cn(
              "whitespace-nowrap font-semibold transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            LMS System
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && !isMobile && "justify-center px-2",
                isActive
                  ? "bg-sidebar-accent text-white shadow-lg shadow-sidebar-accent/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground"
              )
            }
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <item.icon
              className={cn("h-5 w-5 shrink-0", collapsed ? "" : "")}
            />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                collapsed && !isMobile
                  ? "w-0 overflow-hidden opacity-0"
                  : "w-auto opacity-100"
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-muted p-3 space-y-1">
        {user && (
          <div
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-sidebar-foreground/70",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? user.name : undefined}
          >
            <CircleUser className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                collapsed
                  ? "w-0 overflow-hidden opacity-0"
                  : "w-auto opacity-100"
              )}
            >
              {user.name}
            </span>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          title={
            collapsed
              ? theme === "light"
                ? "Dark mode"
                : "Light mode"
              : undefined
          }
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 shrink-0" />
          ) : (
            <Sun className="h-5 w-5 shrink-0" />
          )}
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
            )}
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Выйти" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
            )}
          >
            Выйти
          </span>
        </button>
      </div>

      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 bottom-5 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-foreground shadow-md transition-colors hover:bg-accent cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}
    </aside>
  );
}
