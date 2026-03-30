import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { useState } from "react";

const logs = [
  { id: 1, user: "Maria Santos", action: "Logged in", type: "auth", timestamp: "2024-03-30 09:15 AM", role: "student" },
  { id: 2, user: "Prof. Garcia", action: "Uploaded learning materials for IT101", type: "content", timestamp: "2024-03-30 09:12 AM", role: "faculty" },
  { id: 3, user: "Jose Reyes", action: "Recorded violation for student #2024-001", type: "violation", timestamp: "2024-03-30 09:00 AM", role: "faculty" },
  { id: 4, user: "Admin", action: "Approved achievement submission", type: "approval", timestamp: "2024-03-30 08:45 AM", role: "admin" },
  { id: 5, user: "Carlos Mendoza", action: "Updated profile information", type: "profile", timestamp: "2024-03-30 08:30 AM", role: "student" },
  { id: 6, user: "Ana Cruz", action: "Submitted assignment for IT102", type: "submission", timestamp: "2024-03-30 08:15 AM", role: "student" },
];

const typeColors: Record<string, string> = { auth: "default", content: "secondary", violation: "destructive", approval: "default", profile: "outline", submission: "secondary" };

const AdminLogs = () => {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l => l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Activity Logs</h1>
        <p className="text-muted-foreground text-sm">Track all system actions by users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((log) => (
          <Card key={log.id} className="transition-all duration-200 hover:shadow-md hover:translate-x-1">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{log.action}</p>
                <p className="text-sm text-muted-foreground">by {log.user} ({log.role})</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={typeColors[log.type] as any} className="capitalize">{log.type}</Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLogs;
