import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList, Award, Calendar, AlertTriangle } from "lucide-react";

const stats = [
  { label: "Assigned Students", value: "128", icon: Users, change: "4 sections" },
  { label: "Active Courses", value: "4", icon: BookOpen, change: "IT301, IT302, IT303, IT304" },
  { label: "Pending Submissions", value: "23", icon: ClipboardList, change: "Due this week" },
  { label: "Reported Violations", value: "3", icon: AlertTriangle, change: "1 pending approval" },
];

const FacultyDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Professor</p>
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
            <div className="space-y-3">
              {[
                { time: "8:00 AM", subject: "IT301 - Web Development", room: "Lab 3", section: "BSIT 3A" },
                { time: "10:00 AM", subject: "IT302 - Database Systems", room: "Room 201", section: "BSIT 3B" },
                { time: "1:00 PM", subject: "IT303 - Software Engineering", room: "Lab 1", section: "BSIT 3C" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">{item.time}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.section} &bull; {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: "Maria Santos", assignment: "Project Proposal", status: "Submitted", time: "1 hr ago" },
                { student: "Juan Reyes", assignment: "Lab Exercise 5", status: "Late", time: "3 hrs ago" },
                { student: "Ana Cruz", assignment: "Midterm Project", status: "Submitted", time: "5 hrs ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.student}</p>
                    <p className="text-xs text-muted-foreground">{item.assignment}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.status === "Late" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success-foreground"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
