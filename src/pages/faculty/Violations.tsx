import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus } from "lucide-react";

const violations = [
  { student: "Carlos Mendoza", type: "Academic Dishonesty", severity: "Major", status: "Pending", date: "Mar 30, 2024" },
  { student: "Ana Cruz", type: "Excessive Absences", severity: "Minor", status: "Approved", date: "Mar 25, 2024" },
  { student: "Pedro Lim", type: "Misconduct", severity: "Major", status: "Rejected", date: "Mar 20, 2024" },
];

const statusColors: Record<string, string> = { Pending: "secondary", Approved: "default", Rejected: "destructive" };

const FacultyViolations = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-destructive" /> Violations</h1>
        <p className="text-muted-foreground text-sm">Report and track student violations</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Plus className="h-4 w-4" /> Report Violation</Button>
    </div>
    <div className="space-y-3">
      {violations.map((v, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1">
          <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">{v.type}</h3>
              <p className="text-sm text-muted-foreground">Student: {v.student} • {v.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={v.severity === "Major" ? "destructive" : "outline"}>{v.severity}</Badge>
              <Badge variant={statusColors[v.status] as any}>{v.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultyViolations;
