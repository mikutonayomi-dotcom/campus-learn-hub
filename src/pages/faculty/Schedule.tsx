import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const schedule = [
  { time: "7:30 - 9:00 AM", subject: "IT101 - Intro to Computing", room: "Room 301", section: "1A", day: "Monday, Wednesday, Friday" },
  { time: "9:30 - 11:00 AM", subject: "IT301 - Web Development", room: "Lab 2", section: "3A", day: "Monday, Wednesday, Friday" },
  { time: "1:00 - 2:30 PM", subject: "IT101 - Intro to Computing", room: "Room 301", section: "1B", day: "Tuesday, Thursday" },
  { time: "3:00 - 4:30 PM", subject: "IT301 - Web Development", room: "Lab 2", section: "3A", day: "Tuesday, Thursday" },
];

const FacultySchedule = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> My Schedule</h1>
      <p className="text-muted-foreground text-sm">View your assigned courses, sections, and rooms</p>
    </div>
    <div className="space-y-3">
      {schedule.map((s, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1 group">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-32 shrink-0">
              <div className="flex items-center gap-1 text-primary font-semibold text-sm"><Clock className="h-3.5 w-3.5" />{s.time}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.day}</p>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{s.subject}</p>
              <Badge variant="outline" className="mt-1">Section {s.section}</Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm"><MapPin className="h-3.5 w-3.5" />{s.room}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultySchedule;
