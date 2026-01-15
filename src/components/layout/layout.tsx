import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "md:block",
          isMobile && !mobileOpen && "hidden",
          isMobile && mobileOpen && "block"
        )}
      >
        <Sidebar
          collapsed={isMobile ? false : sidebarCollapsed}
          onToggle={() => {
            if (isMobile) {
              setMobileOpen(false);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          isMobile={isMobile}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          !isMobile && (sidebarCollapsed ? "md:ml-18" : "md:ml-64")
        )}
      >
        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-muted cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">LMS System</span>
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
