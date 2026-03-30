import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, Eye } from "lucide-react";

const students = [
  { id: "2024-001", name: "Maria Santos", section: "3A", course: "BSIT", gpa: "1.5", status: "Regular", attendance: "95%" },
  { id: "2024-002", name: "Carlos Mendoza", section: "1A", course: "BSIT", gpa: "1.75", status: "Regular", attendance: "90%" },
  { id: "2024-003", name: "Ana Cruz", section: "2B", course: "BSIT", gpa: "2.0", status: "Irregular", attendance: "85%" },
  { id: "2024-004", name: "Pedro Lim", section: "3A", course: "BSIT", gpa: "1.25", status: "Regular", attendance: "98%" },
];

const FacultyStudents = () => {
  const [search, setSearch] = useState("");
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> My Students</h1>
        <p className="text-muted-foreground text-sm">View assigned students, profiles, grades, and attendance</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Section</TableHead><TableHead>GPA</TableHead><TableHead>Attendance</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <TableCell className="font-mono text-primary">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.section}</TableCell>
                  <TableCell className="font-semibold">{s.gpa}</TableCell>
                  <TableCell>{s.attendance}</TableCell>
                  <TableCell><Badge variant={s.status === "Regular" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" /> View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyStudents;
