import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertTriangle, Award, CalendarDays, FileText, TrendingUp, Shield, Loader2 } from "lucide-react";
import { useDashboardStats, useActivityLogs, usePendingApprovals } from "@/hooks/useApi";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: logs, isLoading: logsLoading } = useActivityLogs({ per_page: 5 });
  const { data: pendingApprovals, isLoading: pendingLoading } = usePendingApprovals();

  const statItems = [
    { 
      label: "Total Students", 
      value: stats?.students?.total?.toString() || "0", 
      icon: Users, 
      change: `${stats?.students?.by_status?.length || 0} status categories` 
    },
    { 
      label: "Faculty Members", 
      value: stats?.faculty?.total?.toString() || "0", 
      icon: BookOpen, 
      change: "Active faculty" 
    },
    { 
      label: "Active Violations", 
      value: stats?.violations?.total?.toString() || "0", 
      icon: AlertTriangle, 
      change: `${stats?.violations?.pending || 0} pending review` 
    },
    { 
      label: "Achievements", 
      value: stats?.achievements?.total?.toString() || "0", 
      icon: Award, 
      change: `${stats?.achievements?.pending || 0} pending approval` 
    },
    { 
      label: "Upcoming Events", 
      value: stats?.events?.upcoming?.toString() || "0", 
      icon: CalendarDays, 
      change: `${stats?.events?.total || 0} total events` 
    },
    { 
      label: "Pending Approvals", 
      value: pendingApprovals?.total?.toString() || "0", 
      icon: FileText, 
      change: pendingApprovals?.total > 0 ? "Needs attention" : "All caught up" 
    },
  ];

  if (statsLoading || pendingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, System Admin of CCS Profiling System</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of the CCS Profiling System</p>
      </div>

      {/* Shortcut Keys */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Quick Access Shortcuts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "User Management", icon: Users, key: "U" },
              { label: "Courses", icon: BookOpen, key: "C" },
              { label: "Violations", icon: AlertTriangle, key: "V" },
              { label: "Achievements", icon: Award, key: "A" },
              { label: "Events", icon: CalendarDays, key: "E" },
              { label: "Approvals", icon: FileText, key: "P" },
            ].map((shortcut) => (
              <div
                key={shortcut.label}
                className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors cursor-pointer"
              >
                <shortcut.icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-foreground">{shortcut.label}</span>
                <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((stat) => (
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
            {logsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : logs?.data?.length > 0 ? (
              <div className="space-y-3">
                {logs.data.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <p className="text-sm text-foreground">{item.description}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
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
                { label: "Pending Approvals", value: pendingApprovals?.total?.toString() || "0", color: pendingApprovals?.total > 0 ? "bg-warning" : "bg-success" },
                { label: "Unresolved Violations", value: stats?.violations?.pending?.toString() || "0", color: stats?.violations?.pending > 0 ? "bg-destructive" : "bg-success" },
                { label: "Organizations", value: stats?.organizations?.total?.toString() || "0", color: "bg-primary" },
                { label: "System Status", value: "Operational", color: "bg-success" },
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
