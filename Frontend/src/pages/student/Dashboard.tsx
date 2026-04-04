import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Award, Calendar, AlertTriangle, Bell } from "lucide-react";

const stats = [
  { label: "Enrolled Subjects", value: "6", icon: BookOpen, change: "2nd Semester" },
  { label: "Pending Tasks", value: "5", icon: ClipboardList, change: "2 due tomorrow" },
  { label: "Achievements", value: "3", icon: Award, change: "1 pending verification" },
  { label: "Violations", value: "0", icon: AlertTriangle, change: "Clean record" },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Student</p>
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
            <div className="space-y-3">
              {[
                { time: "8:00 AM", subject: "IT301 - Web Development", room: "Lab 3", faculty: "Prof. Santos" },
                { time: "10:00 AM", subject: "IT302 - Database Systems", room: "Room 201", faculty: "Prof. Reyes" },
                { time: "1:00 PM", subject: "GE104 - Ethics", room: "Room 105", faculty: "Prof. Cruz" },
                { time: "3:00 PM", subject: "IT303 - Software Engineering", room: "Lab 1", faculty: "Prof. Garcia" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">{item.time}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.faculty} &bull; {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: "New grades posted for IT301", time: "30 min ago", type: "grade" },
                { text: "Assignment due: Lab Exercise 5", time: "2 hrs ago", type: "task" },
                { text: "Hackathon 2026 registration open", time: "1 day ago", type: "event" },
                { text: "New learning material uploaded", time: "2 days ago", type: "material" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <p className="text-sm text-foreground">{item.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
