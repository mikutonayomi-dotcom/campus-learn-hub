import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const schedules = [
  { time: "7:30 - 9:00", subject: "IT101 - Intro to Computing", room: "Room 301", faculty: "Prof. Garcia", section: "1A", day: "MWF" },
  { time: "9:00 - 10:30", subject: "IT102 - Programming 1", room: "Lab 1", faculty: "Prof. Reyes", section: "1A", day: "MWF" },
  { time: "10:30 - 12:00", subject: "IT201 - Data Structures", room: "Room 302", faculty: "Prof. Santos", section: "2A", day: "TTH" },
  { time: "1:00 - 2:30", subject: "IT301 - Web Dev", room: "Lab 2", faculty: "Prof. Garcia", section: "3A", day: "MWF" },
  { time: "2:30 - 4:00", subject: "IT302 - Database Mgmt", room: "Lab 1", faculty: "Prof. Reyes", section: "3A", day: "TTH" },
];

const AdminScheduling = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Scheduling</h1>
      <p className="text-muted-foreground text-sm">Create and manage class schedules, avoid conflicts</p>
    </div>

    <div className="grid gap-3">
      {schedules.map((s, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-24 shrink-0">
              <div className="flex items-center gap-1 text-primary font-semibold text-sm"><Clock className="h-3.5 w-3.5" />{s.time}</div>
              <Badge variant="outline" className="mt-1 text-xs">{s.day}</Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{s.subject}</p>
              <p className="text-sm text-muted-foreground">{s.faculty} • Section {s.section}</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm shrink-0"><MapPin className="h-3.5 w-3.5" />{s.room}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminScheduling;
