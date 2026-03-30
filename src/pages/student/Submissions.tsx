import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Upload, Eye } from "lucide-react";

const submissions = [
  { assignment: "IT301 - Project Proposal", date: "Mar 30, 2024", status: "Submitted", grade: "-", feedback: "" },
  { assignment: "IT302 - ER Diagram", date: "Mar 28, 2024", status: "Graded", grade: "92", feedback: "Good work!" },
  { assignment: "IT301 - Lab Exercise 3", date: "Mar 25, 2024", status: "Graded", grade: "88", feedback: "Review CSS Grid" },
  { assignment: "IT303 - SDLC Paper", date: "Mar 20, 2024", status: "Late", grade: "-", feedback: "" },
];

const statusColors: Record<string, string> = { Submitted: "secondary", Graded: "default", Late: "destructive" };

const StudentSubmissions = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /> Submissions</h1>
        <p className="text-muted-foreground text-sm">Upload assignments and track grades</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Upload className="h-4 w-4" /> New Submission</Button>
    </div>
    <div className="space-y-3">
      {submissions.map((s, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1">
          <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{s.assignment}</h3>
              <p className="text-sm text-muted-foreground">{s.date}</p>
              {s.feedback && <p className="text-sm text-primary mt-1">Feedback: {s.feedback}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {s.grade !== "-" && <Badge variant="default">Grade: {s.grade}</Badge>}
              <Badge variant={statusColors[s.status] as any}>{s.status}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default StudentSubmissions;
