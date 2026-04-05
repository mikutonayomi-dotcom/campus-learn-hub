import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Award, Calendar, AlertTriangle, Bell, Loader2 } from "lucide-react";
import { useMySchedule, useMySubmissions, useMyProfile, useNotifications, useUnreadCount } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: schedule, isLoading: scheduleLoading } = useMySchedule();
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions();
  const { data: notifications, isLoading: notifLoading } = useNotifications();
  const { data: unreadCount } = useUnreadCount();

  const isLoading = profileLoading || scheduleLoading || submissionsLoading || notifLoading;

  // Calculate stats
  const pendingTasks = submissions?.filter((s: any) => s.status === 'submitted')?.length || 0;
  const approvedAchievements = profile?.achievements?.filter((a: any) => a.status === 'approved')?.length || 0;
  const violationsCount = profile?.violations?.filter((v: any) => v.status === 'approved')?.length || 0;

  const stats = [
    { label: "Enrolled Subjects", value: schedule?.length?.toString() || "0", icon: BookOpen, change: "Current Semester" },
    { label: "Pending Tasks", value: pendingTasks.toString(), icon: ClipboardList, change: "Awaiting grade" },
    { label: "Achievements", value: approvedAchievements.toString(), icon: Award, change: "Approved records" },
    { label: "Violations", value: violationsCount.toString(), icon: AlertTriangle, change: violationsCount === 0 ? "Clean record" : "On file" },
  ];

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todaysClasses = schedule?.filter((s: any) => s.day === today) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name || "Student"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {item.start_time?.substring(0, 5)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.subject?.code} - {item.subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.faculty?.user?.name} &bull; {item.room?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications?.slice(0, 5).map((item: any) => (
                  <div key={item.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${!item.is_read ? 'bg-muted/50 -mx-4 px-4' : ''}`}>
                    <p className="text-sm text-foreground">{item.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
