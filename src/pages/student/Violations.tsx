import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const violations = [
  { type: "Excessive Absences", status: "Approved", severity: "Minor", remarks: "3 consecutive absences in IT301", date: "Mar 25, 2024" },
  { type: "Late Submission", status: "Pending", severity: "Minor", remarks: "IT303 paper submitted 2 days late", date: "Mar 22, 2024" },
];

const StudentViolations = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-destructive" /> Violations</h1>
      <p className="text-muted-foreground text-sm">View your disciplinary records and violation status</p>
    </div>
    {violations.length === 0 ? (
      <Card><CardContent className="p-8 text-center text-muted-foreground">No violations recorded. Keep it up! 🎉</CardContent></Card>
    ) : (
      <div className="space-y-3">
        {violations.map((v, i) => (
          <Card key={i} className="transition-all duration-200 hover:shadow-md border-l-4 border-l-destructive/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{v.type}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{v.remarks}</p>
                  <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={v.severity === "Major" ? "destructive" : "outline"}>{v.severity}</Badge>
                  <Badge variant={v.status === "Approved" ? "default" : "secondary"}>{v.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export default StudentViolations;
