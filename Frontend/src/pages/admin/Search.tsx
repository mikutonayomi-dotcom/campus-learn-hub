import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, X, Loader2, User, GraduationCap, BookOpen } from "lucide-react";
import { useStudents, useFaculty, useCourses, useSkills, useOrganizations } from "@/hooks/useApi";
import StudentProfileView from "@/components/StudentProfileView";

const AdminSearch = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: faculty, isLoading: facultyLoading } = useFaculty();
  const { data: courses } = useCourses();
  const { data: skills } = useSkills();
  const { data: organizations } = useOrganizations();
  
  const [activeTab, setActiveTab] = useState<"students" | "faculty">("students");
  
  // Student filters
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterYearLevel, setFilterYearLevel] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [filterSkillIds, setFilterSkillIds] = useState<number[]>([]);
  const [filterHasViolations, setFilterHasViolations] = useState("");
  const [filterViolationSeverity, setFilterViolationSeverity] = useState("");
  const [filterHasAchievements, setFilterHasAchievements] = useState("");
  const [filterOrganizationIds, setFilterOrganizationIds] = useState<number[]>([]);
  
  // Faculty filters
  const [facultySearchTerm, setFacultySearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredStudents = students?.filter((student: any) => {
    const matchesSearch = 
      student.user?.name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.user?.email?.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    const matchesCourse = !filterCourseId || student.course_id === parseInt(filterCourseId);
    const matchesYear = !filterYearLevel || student.year_level === parseInt(filterYearLevel);
    const matchesSemester = !filterSemester || student.semester === filterSemester;
    const matchesSection = !filterSectionId || student.section_id === parseInt(filterSectionId);
    
    const matchesSkills = filterSkillIds.length === 0 || 
      student.skills?.some((skill: any) => filterSkillIds.includes(skill.id));
    
    const matchesViolations = !filterHasViolations || 
      (filterHasViolations === "true" ? student.violations?.length > 0 : student.violations?.length === 0);
    
    const matchesSeverity = !filterViolationSeverity || 
      student.violations?.some((v: any) => v.severity === filterViolationSeverity);
    
    const matchesAchievements = !filterHasAchievements || 
      (filterHasAchievements === "true" ? student.achievements?.length > 0 : student.achievements?.length === 0);
    
    const matchesOrganizations = filterOrganizationIds.length === 0 || 
      student.organizations?.some((org: any) => filterOrganizationIds.includes(org.id));

    return matchesSearch && matchesCourse && matchesYear && matchesSemester && matchesSection && 
           matchesSkills && matchesViolations && matchesSeverity && matchesAchievements && matchesOrganizations;
  }) || [];

  const filteredFaculty = faculty?.filter((f: any) => {
    const matchesSearch = 
      f.user?.name?.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
      f.employee_id?.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
      f.user?.email?.toLowerCase().includes(facultySearchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || f.department?.toLowerCase().includes(filterDepartment.toLowerCase());
    const matchesPosition = !filterPosition || f.position?.toLowerCase().includes(filterPosition.toLowerCase());

    return matchesSearch && matchesDepartment && matchesPosition;
  }) || [];

  const clearStudentFilters = () => {
    setStudentSearchTerm("");
    setFilterCourseId("");
    setFilterYearLevel("");
    setFilterSemester("");
    setFilterSectionId("");
    setFilterSkillIds([]);
    setFilterHasViolations("");
    setFilterViolationSeverity("");
    setFilterHasAchievements("");
    setFilterOrganizationIds([]);
  };

  const clearFacultyFilters = () => {
    setFacultySearchTerm("");
    setFilterDepartment("");
    setFilterPosition("");
  };

  const hasActiveStudentFilters = studentSearchTerm || filterCourseId || filterYearLevel || filterSemester || 
    filterSectionId || filterSkillIds.length > 0 || filterHasViolations || filterViolationSeverity || 
    filterHasAchievements || filterOrganizationIds.length > 0;

  const hasActiveFacultyFilters = facultySearchTerm || filterDepartment || filterPosition;

  // Get unique sections based on selected course and year
  const availableSections = courses?.find((c: any) => c.id === parseInt(filterCourseId))?.sections?.filter(
    (s: any) => (!filterYearLevel || s.year_level === parseInt(filterYearLevel))
  ) || [];

  // Get unique departments
  const departments = faculty?.reduce((acc: string[], f: any) => {
    if (f.department && !acc.includes(f.department)) {
      acc.push(f.department);
    }
    return acc;
  }, []) || [];

  // Get unique positions
  const positions = faculty?.reduce((acc: string[], f: any) => {
    if (f.position && !acc.includes(f.position)) {
      acc.push(f.position);
    }
    return acc;
  }, []) || [];

  if (studentsLoading || facultyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Comprehensive Search</h1>
        <p className="text-muted-foreground text-sm">
          Search and filter students and faculty across the entire system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "students" | "faculty")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="students" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="faculty" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Faculty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name, student ID, or email..." 
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {hasActiveStudentFilters && (
                    <Button variant="ghost" size="sm" onClick={clearStudentFilters} className="gap-1 text-muted-foreground">
                      <X className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <Label>Semester</Label>
                    <Select value={filterSemester || "all"} onValueChange={(value) => setFilterSemester(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All semesters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All semesters</SelectItem>
                        <SelectItem value="1st">1st Semester</SelectItem>
                        <SelectItem value="2nd">2nd Semester</SelectItem>
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

                {filterHasViolations === "true" && (
                  <div className="space-y-2">
                    <Label>Violation Severity</Label>
                    <Select value={filterViolationSeverity || "all"} onValueChange={(value) => setFilterViolationSeverity(value === "all" ? "" : value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All severities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

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
                Student Search Results
                <Badge variant="secondary">{filteredStudents.length} students</Badge>
              </CardTitle>
              <CardDescription>
                {hasActiveStudentFilters ? "Filtered results based on your criteria" : "Showing all students"}
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
                      <TableHead>Semester</TableHead>
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
                        <TableCell>{student.semester || "-"}</TableCell>
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
                    {hasActiveStudentFilters ? 'Try adjusting your search or filters' : 'No students in the database'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name, employee ID, or email..." 
                      value={facultySearchTerm}
                      onChange={(e) => setFacultySearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {hasActiveFacultyFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFacultyFilters} className="gap-1 text-muted-foreground">
                      <X className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={filterDepartment || "all"} onValueChange={(value) => setFilterDepartment(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        {departments.map((dept: string) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select value={filterPosition || "all"} onValueChange={(value) => setFilterPosition(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All positions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All positions</SelectItem>
                        {positions.map((pos: string) => (
                          <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Faculty Search Results
                <Badge variant="secondary">{filteredFaculty.length} faculty</Badge>
              </CardTitle>
              <CardDescription>
                {hasActiveFacultyFilters ? "Filtered results based on your criteria" : "Showing all faculty"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaculty.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaculty.map((f: any) => (
                      <TableRow key={f.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{f.user?.name}</TableCell>
                        <TableCell className="text-muted-foreground">{f.employee_id}</TableCell>
                        <TableCell>{f.department || "-"}</TableCell>
                        <TableCell>{f.position || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{f.user?.email}</TableCell>
                        <TableCell>
                          <Badge variant={f.is_active ? "default" : "secondary"} className="capitalize">
                            {f.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No faculty found</h3>
                  <p className="text-muted-foreground">
                    {hasActiveFacultyFilters ? 'Try adjusting your search or filters' : 'No faculty in the database'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

export default AdminSearch;
