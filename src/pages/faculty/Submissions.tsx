import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, Download, MessageSquare } from "lucide-react";

const submissions = [
  { student: "Maria Santos", assignment: "IT301 - Project Proposal", date: "Mar 30, 2024", status: "Pending", type: "PDF" },
  { student: "Carlos Mendoza", assignment: "IT101 - Essay on AI", date: "Mar 29, 2024", status: "Graded", grade: "95", type: "DOCX" },
  { student: "Ana Cruz", assignment: "IT301 - Lab Exercise 3", date: "Mar 28, 2024", status: "Reviewed", type: "ZIP" },
  { student: "Pedro Lim", assignment: "IT101 - Quiz 2 Submission", date: "Mar 27, 2024", status: "Pending", type: "PDF" },
];

const statusColors: Record<string, string> = { Pending: "secondary", Graded: "default", Reviewed: "outline" };

const FacultySubmissions = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><FolderOpen className="h-6 w-6 text-primary" /> Submissions</h1>
      <p className="text-muted-foreground text-sm">Review, grade, and give feedback on student work</p>
    </div>
    <div className="space-y-3">
      {submissions.map((s, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1">
          <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{s.assignment}</h3>
              <p className="text-sm text-muted-foreground">{s.student} • {s.date} • {s.type}</p>
            </div>
            <div className="flex items-center gap-2">
              {s.grade && <Badge variant="default">Grade: {s.grade}</Badge>}
              <Badge variant={statusColors[s.status] as any}>{s.status}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultySubmissions;
