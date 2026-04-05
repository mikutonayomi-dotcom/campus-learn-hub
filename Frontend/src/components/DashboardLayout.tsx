import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Users, BookOpen, ClipboardList, Calendar, Award, Bell, BarChart3,
  Settings, LogOut, Menu, X, Shield, Building, Search, FileText,
  GraduationCap, AlertTriangle, FolderOpen, CalendarDays, UsersRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import ucLogo from "@/assets/uc-logo.png";
import ccsLogo from "@/assets/ccs-logo.png";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: BarChart3, path: "/admin" },
  { label: "User Management", icon: Users, path: "/admin/users" },
  { label: "Activity Logs", icon: FileText, path: "/admin/logs" },
  { label: "Approvals", icon: ClipboardList, path: "/admin/approvals" },
  { label: "Courses", icon: GraduationCap, path: "/admin/courses" },
  { label: "Sections", icon: UsersRound, path: "/admin/sections" },
  { label: "Schedules", icon: Calendar, path: "/admin/schedules" },
  { label: "Facilities", icon: Building, path: "/admin/facilities" },
  { label: "Events", icon: CalendarDays, path: "/admin/events" },
  { label: "Advanced Search", icon: Search, path: "/admin/search" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const facultyNav: NavItem[] = [
  { label: "Dashboard", icon: BarChart3, path: "/faculty" },
  { label: "My Students", icon: Users, path: "/faculty/students" },
  { label: "Violations", icon: AlertTriangle, path: "/faculty/violations" },
  { label: "Achievements", icon: Award, path: "/faculty/achievements" },
  { label: "Courses & Materials", icon: BookOpen, path: "/faculty/courses" },
  { label: "Submissions", icon: FolderOpen, path: "/faculty/submissions" },
  { label: "Schedule", icon: Calendar, path: "/faculty/schedule" },
  { label: "Events", icon: CalendarDays, path: "/faculty/events" },
  { label: "Reports", icon: BarChart3, path: "/faculty/reports" },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: BarChart3, path: "/student" },
  { label: "My Profile", icon: GraduationCap, path: "/student/profile" },
  { label: "Academics", icon: BookOpen, path: "/student/academics" },
  { label: "Materials", icon: FolderOpen, path: "/student/materials" },
  { label: "Submissions", icon: ClipboardList, path: "/student/submissions" },
  { label: "Violations", icon: AlertTriangle, path: "/student/violations" },
  { label: "Achievements", icon: Award, path: "/student/achievements" },
  { label: "Events", icon: CalendarDays, path: "/student/events" },
  { label: "Organizations", icon: UsersRound, path: "/student/organizations" },
];

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case "admin": return adminNav;
    case "faculty": return facultyNav;
    case "student": return studentNav;
    default: return [];
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin": return "System Admin";
    case "faculty": return "Faculty";
    case "student": return "Student";
    default: return "";
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin": return Shield;
    case "faculty": return BookOpen;
    case "student": return GraduationCap;
    default: return Users;
  }
};

interface DashboardLayoutProps {
  role: "admin" | "faculty" | "student";
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = getNavItems(role);
  const RoleIcon = getRoleIcon(role);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo area */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={ccsLogo} alt="CCS" className="w-10 h-10 object-contain transition-transform duration-200 hover:scale-110" />
            <div className="min-w-0">
              <h1 className="text-sm font-display font-bold text-sidebar-foreground truncate">CCS Profiling</h1>
              <p className="text-xs text-sidebar-foreground/60">System</p>
            </div>
            <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent transition-colors duration-200">
            <RoleIcon className="h-4 w-4 text-sidebar-primary" />
            <span className="text-xs font-semibold text-sidebar-foreground">{getRoleLabel(role)}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:translate-x-1"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center px-4 gap-4 shrink-0 transition-colors duration-300">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <img src={ucLogo} alt="UC" className="h-8 w-8 object-contain" />
            <span className="text-sm font-display font-semibold text-foreground hidden sm:block">
              University of Cabuyao
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative group">
              <Bell className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold transition-transform duration-200 hover:scale-110 cursor-pointer">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
