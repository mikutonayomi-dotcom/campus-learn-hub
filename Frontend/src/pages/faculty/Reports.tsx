import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText } from "lucide-react";

const reports = [
  { title: "Class Performance Report", description: "GPA distribution and pass/fail rates for your classes" },
  { title: "Student Violations Summary", description: "Violation reports you've submitted and their status" },
  { title: "Attendance Report", description: "Student attendance rates across your sections" },
];

const FacultyReports = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Reports</h1>
      <p className="text-muted-foreground text-sm">Generate reports for your classes</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((r, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{r.title}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{r.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1 text-xs"><Download className="h-3 w-3" /> PDF</Button>
              <Button size="sm" variant="outline" className="gap-1 text-xs"><Download className="h-3 w-3" /> Excel</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultyReports;
