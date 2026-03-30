import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertTriangle, Award, CalendarDays, FileText, TrendingUp, Shield } from "lucide-react";

const stats = [
  { label: "Total Students", value: "486", icon: Users, change: "+12 this semester" },
  { label: "Faculty Members", value: "24", icon: BookOpen, change: "3 sections each" },
  { label: "Active Violations", value: "8", icon: AlertTriangle, change: "2 pending review" },
  { label: "Achievements", value: "52", icon: Award, change: "+5 this month" },
  { label: "Upcoming Events", value: "6", icon: CalendarDays, change: "Next: Mar 31" },
  { label: "Pending Approvals", value: "14", icon: FileText, change: "Needs attention" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of the CCS Profiling System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: "Prof. Santos uploaded grades for IT301", time: "2 min ago" },
                { text: "New violation report submitted", time: "15 min ago" },
                { text: "Student Juan Dela Cruz updated profile", time: "1 hr ago" },
                { text: "Event 'Hackathon 2026' created", time: "2 hrs ago" },
                { text: "3 new student registrations approved", time: "3 hrs ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <p className="text-sm text-foreground">{item.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Active Users Online", value: "47", color: "bg-success" },
                { label: "Pending Approvals", value: "14", color: "bg-warning" },
                { label: "Unresolved Violations", value: "8", color: "bg-destructive" },
                { label: "System Uptime", value: "99.9%", color: "bg-primary" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
