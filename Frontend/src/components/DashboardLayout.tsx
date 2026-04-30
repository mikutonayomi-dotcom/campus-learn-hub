import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Users, BookOpen, Calendar, Award, Bell, BarChart3,
  LogOut, Menu, X, Shield, Building, LayoutDashboard, Clock, User,
  GraduationCap, AlertTriangle, CalendarDays, UsersRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useNotifications, useUnreadNotificationCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Course/Subject", icon: BookOpen, path: "/admin/course-subjects" },
  { label: "Sections", icon: UsersRound, path: "/admin/sections" },
  { label: "Facilities (Rooms)", icon: Building, path: "/admin/rooms" },
  { label: "Scheduling", icon: Calendar, path: "/admin/scheduling" },
  { label: "Violations", icon: AlertTriangle, path: "/admin/violations" },
  { label: "Organizations", icon: UsersRound, path: "/admin/organizations" },
  { label: "Events", icon: CalendarDays, path: "/admin/events" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

const facultyNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/faculty" },
  { label: "My Courses", icon: BookOpen, path: "/faculty/courses" },
  { label: "Students", icon: Users, path: "/faculty/students" },
  { label: "Violations", icon: AlertTriangle, path: "/faculty/violations" },
  { label: "Achievements", icon: Award, path: "/faculty/achievements" },
  { label: "Events", icon: Calendar, path: "/faculty/events" },
  { label: "Reports", icon: BarChart3, path: "/faculty/reports" },
  { label: "Schedule", icon: Clock, path: "/faculty/schedule" },
  { label: "Profile", icon: User, path: "/faculty/profile" },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: BarChart3, path: "/student" },
  { label: "My Profile", icon: GraduationCap, path: "/student/profile" },
  { label: "Academics", icon: BookOpen, path: "/student/academics" },
  { label: "Schedule", icon: Calendar, path: "/student/schedule" },
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
  
  // Notification hooks
  const { data: notifications } = useNotifications();
  const { data: unreadCountData } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  
  const unreadCount = unreadCountData?.count || 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                  <Bell className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center p-0 animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-64">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-accent",
                            !notification.is_read && "bg-accent/50"
                          )}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              "mt-0.5 h-2 w-2 rounded-full",
                              notification.is_read ? "bg-muted" : "bg-primary"
                            )} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                    )}
                  </ScrollArea>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold transition-transform duration-200 hover:scale-110 cursor-pointer">
              {user?.profile_image ? (
                <img 
                  src={`http://localhost:8000/storage/${user.profile_image}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || "U"
              )}
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
