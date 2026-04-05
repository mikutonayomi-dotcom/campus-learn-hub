import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList, Award, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { useMyStudents, useMySchedule, useSubmissionsToGrade, useFacultyProfile } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useMyStudents();
  const { data: schedule, isLoading: scheduleLoading } = useMySchedule();
  const { data: submissions, isLoading: submissionsLoading } = useSubmissionsToGrade();
  const { data: profile, isLoading: profileLoading } = useFacultyProfile();

  const isLoading = studentsLoading || scheduleLoading || submissionsLoading || profileLoading;

  // Get unique courses from schedule
  const uniqueCourses = schedule ? [...new Set(schedule.map((s: any) => s.subject?.code).filter(Boolean))] : [];
  
  // Get reported violations
  const reportedViolations = profile?.violations?.filter((v: any) => v.reported_by === profile.id) || [];
  const pendingViolations = reportedViolations.filter((v: any) => v.status === 'pending').length;

  const stats = [
    { label: "Assigned Students", value: students?.length?.toString() || "0", icon: Users, change: "From your sections" },
    { label: "Active Courses", value: uniqueCourses.length.toString(), icon: BookOpen, change: uniqueCourses.join(", ") || "No courses" },
    { label: "Pending Submissions", value: submissions?.length?.toString() || "0", icon: ClipboardList, change: "To grade" },
    { label: "Reported Violations", value: reportedViolations.length.toString(), icon: AlertTriangle, change: `${pendingViolations} pending approval` },
  ];

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todaysSchedule = schedule?.filter((s: any) => s.day === today) || [];

  // Get recent submissions
  const recentSubmissions = submissions?.slice(0, 5) || [];

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
        <h1 className="text-2xl font-display font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name || "Professor"}</p>
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
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysSchedule.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todaysSchedule.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {item.start_time?.substring(0, 5)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.subject?.code} - {item.subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.section?.name} &bull; {item.room?.name}</p>
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
              <Award className="h-5 w-5 text-primary" />
              Recent Submissions to Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending submissions</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.student?.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.material?.title}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === "late" ? "bg-destructive/10 text-destructive" : 
                      item.status === "graded" ? "bg-success/10 text-success-foreground" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {item.status}
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

export default FacultyDashboard;
