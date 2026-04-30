import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, Loader2, User } from "lucide-react";
import { useStudents, useCourses, useSkills, useOrganizations } from "@/hooks/useApi";
import StudentProfileView from "@/components/StudentProfileView";

const FacultySearch = () => {
  const { data: students, isLoading } = useStudents();
  const { data: courses } = useCourses();
  const { data: skills } = useSkills();
  const { data: organizations } = useOrganizations();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterYearLevel, setFilterYearLevel] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [filterSkillIds, setFilterSkillIds] = useState<number[]>([]);
  const [filterHasViolations, setFilterHasViolations] = useState("");
  const [filterHasAchievements, setFilterHasAchievements] = useState("");
  const [filterOrganizationIds, setFilterOrganizationIds] = useState<number[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredStudents = students?.filter((student: any) => {
    const matchesSearch = 
      student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !filterCourseId || student.course_id === parseInt(filterCourseId);
    const matchesYear = !filterYearLevel || student.year_level === parseInt(filterYearLevel);
    const matchesSection = !filterSectionId || student.section_id === parseInt(filterSectionId);
    
    const matchesSkills = filterSkillIds.length === 0 || 
      student.skills?.some((skill: any) => filterSkillIds.includes(skill.id));
    
    const matchesViolations = !filterHasViolations || 
      (filterHasViolations === "true" ? student.violations?.length > 0 : student.violations?.length === 0);
    
    const matchesAchievements = !filterHasAchievements || 
      (filterHasAchievements === "true" ? student.achievements?.length > 0 : student.achievements?.length === 0);
    
    const matchesOrganizations = filterOrganizationIds.length === 0 || 
      student.organizations?.some((org: any) => filterOrganizationIds.includes(org.id));

    return matchesSearch && matchesCourse && matchesYear && matchesSection && 
           matchesSkills && matchesViolations && matchesAchievements && matchesOrganizations;
  }) || [];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCourseId("");
    setFilterYearLevel("");
    setFilterSectionId("");
    setFilterSkillIds([]);
    setFilterHasViolations("");
    setFilterHasAchievements("");
    setFilterOrganizationIds([]);
  };

  const hasActiveFilters = searchTerm || filterCourseId || filterYearLevel || filterSectionId || 
    filterSkillIds.length > 0 || filterHasViolations || filterHasAchievements || filterOrganizationIds.length > 0;

  // Get unique sections based on selected course and year
  const availableSections = courses?.find((c: any) => c.id === parseInt(filterCourseId))?.sections?.filter(
    (s: any) => !filterYearLevel || s.year_level === parseInt(filterYearLevel)
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Comprehensive Student Search</h1>
        <p className="text-muted-foreground text-sm">
          Search and filter students across all sections using multiple criteria
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, student ID, or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={filterCourseId || "all"} onValueChange={(value) => {
                  setFilterCourseId(value === "all" ? "" : value);
                  setFilterSectionId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All courses</SelectItem>
                    {courses?.map((course: any) => (
                      <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year Level</Label>
                <Select value={filterYearLevel || "all"} onValueChange={(value) => {
                  setFilterYearLevel(value === "all" ? "" : value);
                  setFilterSectionId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {[1, 2, 3, 4].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={filterSectionId || "all"} onValueChange={(value) => setFilterSectionId(value === "all" ? "" : value)} disabled={!filterCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder={filterCourseId ? "Select section" : "Select course first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {availableSections.map((section: any) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Violations</Label>
                <Select value={filterHasViolations || "all"} onValueChange={(value) => setFilterHasViolations(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    <SelectItem value="true">With violations</SelectItem>
                    <SelectItem value="false">No violations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Skills (multi-select)</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1 bg-background">
                  {skills?.map((skill: any) => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill.id}`}
                        checked={filterSkillIds.includes(skill.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterSkillIds([...filterSkillIds, skill.id]);
                          } else {
                            setFilterSkillIds(filterSkillIds.filter(id => id !== skill.id));
                          }
                        }}
                      />
                      <label htmlFor={`skill-${skill.id}`} className="text-sm cursor-pointer">
                        {skill.name} <span className="text-muted-foreground">({skill.category})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Organizations (multi-select)</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1 bg-background">
                  {organizations?.map((org: any) => (
                    <div key={org.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`org-${org.id}`}
                        checked={filterOrganizationIds.includes(org.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterOrganizationIds([...filterOrganizationIds, org.id]);
                          } else {
                            setFilterOrganizationIds(filterOrganizationIds.filter(id => id !== org.id));
                          }
                        }}
                      />
                      <label htmlFor={`org-${org.id}`} className="text-sm cursor-pointer">
                        {org.name} <span className="text-muted-foreground">({org.category})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label>Achievements</Label>
              <Select value={filterHasAchievements || "all"} onValueChange={(value) => setFilterHasAchievements(value === "all" ? "" : value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All students</SelectItem>
                  <SelectItem value="true">With achievements</SelectItem>
                  <SelectItem value="false">No achievements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Search Results
            <Badge variant="secondary">{filteredStudents.length} students</Badge>
          </CardTitle>
          <CardDescription>
            {hasActiveFilters ? "Filtered results based on your criteria" : "Showing all students"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Orgs</TableHead>
                  <TableHead>Achievements</TableHead>
                  <TableHead>Violations</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student: any) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{student.user?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.student_id}</TableCell>
                    <TableCell>{student.course?.name || "-"}</TableCell>
                    <TableCell>{student.year_level ? `${student.year_level}${student.year_level === 1 ? 'st' : student.year_level === 2 ? 'nd' : student.year_level === 3 ? 'rd' : 'th'}` : "-"}</TableCell>
                    <TableCell>{student.section?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.skills?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.organizations?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.achievements?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.violations?.length > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {student.violations.length}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">0</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setIsProfileOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {hasActiveFilters ? 'Try adjusting your search or filters' : 'No students in the database'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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

export default FacultySearch;
