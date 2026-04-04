import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from "lucide-react";

const courses = [
  { code: "IT101", name: "Introduction to Computing", units: 3, sections: ["1A", "1B", "1C"], faculty: "Prof. Garcia" },
  { code: "IT102", name: "Computer Programming 1", units: 3, sections: ["1A", "1B"], faculty: "Prof. Reyes" },
  { code: "IT201", name: "Data Structures", units: 3, sections: ["2A", "2B"], faculty: "Prof. Santos" },
  { code: "IT301", name: "Web Development", units: 3, sections: ["3A"], faculty: "Prof. Garcia" },
  { code: "IT302", name: "Database Management", units: 3, sections: ["3A", "3B"], faculty: "Prof. Reyes" },
];

const AdminAcademics = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Courses & Sections</h1>
        <p className="text-muted-foreground text-sm">Manage courses, sections, subjects, and curriculum</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Plus className="h-4 w-4" /> Add Course</Button>
    </div>

    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Faculty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.code} className="transition-colors duration-150 hover:bg-muted/50 cursor-pointer">
                <TableCell className="font-mono font-semibold text-primary">{c.code}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.units}</TableCell>
                <TableCell><div className="flex gap-1">{c.sections.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}</div></TableCell>
                <TableCell className="text-muted-foreground">{c.faculty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminAcademics;
