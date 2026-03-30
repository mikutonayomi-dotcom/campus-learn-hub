import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, MapPin, User } from "lucide-react";

const subjects = [
  { code: "IT301", name: "Web Development", faculty: "Prof. Garcia", room: "Lab 2", schedule: "MWF 9:30-11:00", grade: "1.50" },
  { code: "IT302", name: "Database Management", faculty: "Prof. Reyes", room: "Lab 1", schedule: "TTH 2:30-4:00", grade: "1.75" },
  { code: "IT303", name: "Software Engineering", faculty: "Prof. Santos", room: "Room 301", schedule: "MWF 1:00-2:30", grade: "-" },
  { code: "GE101", name: "Purposive Communication", faculty: "Prof. Cruz", room: "Room 201", schedule: "TTH 9:00-10:30", grade: "2.00" },
];

const StudentAcademics = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Academics</h1>
      <p className="text-muted-foreground text-sm">View your subjects, schedule, faculty, and grades</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((s) => (
        <Card key={s.code} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-primary font-mono">{s.code}</span>{s.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground"><User className="h-3.5 w-3.5" />{s.faculty}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{s.schedule}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{s.room}</p>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-muted-foreground">Grade</span>
                <Badge variant={s.grade === "-" ? "secondary" : "default"}>{s.grade === "-" ? "Pending" : s.grade}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default StudentAcademics;
