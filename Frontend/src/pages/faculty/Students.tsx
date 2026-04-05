import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, Eye, Loader2 } from "lucide-react";
import { useMyStudents } from "@/hooks/useApi";
import StudentProfileView from "@/components/StudentProfileView";

const FacultyStudents = () => {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: students, isLoading } = useMyStudents();

  const filtered = students?.filter((s: any) => 
    s.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.student_id?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsProfileOpen(true);
  };

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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Section</TableHead><TableHead>Course</TableHead><TableHead>Year</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s: any) => (
                    <TableRow key={s.id} className="transition-colors duration-150 hover:bg-muted/50">
                      <TableCell className="font-mono text-primary">{s.student_id}</TableCell>
                      <TableCell className="font-medium">{s.user?.name}</TableCell>
                      <TableCell>{s.section}</TableCell>
                      <TableCell>{s.course?.code}</TableCell>
                      <TableCell>{s.year_level}</TableCell>
                      <TableCell><Badge variant={s.status === "regular" ? "default" : "secondary"} className="capitalize">{s.status}</Badge></TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleViewProfile(s.id)}
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Profile Modal */}
      <StudentProfileView 
        studentId={selectedStudentId}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedStudentId(null);
        }}
      />
    </div>
  );
};

export default FacultyStudents;
