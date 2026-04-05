import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, GraduationCap, Eye, Loader2, Award, AlertTriangle, X } from "lucide-react";
import { useSearchStudents, useFilterOptions, useSkills, useCourses } from "@/hooks/useApi";
import StudentProfileView from "@/components/StudentProfileView";

const AdminSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [noViolations, setNoViolations] = useState<boolean>(false);
  const [hasAchievements, setHasAchievements] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Build query params
  const queryParams: any = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedCourse && selectedCourse !== "all") queryParams.course_id = selectedCourse;
  if (selectedYearLevel && selectedYearLevel !== "all") queryParams.year_level = selectedYearLevel;
  if (selectedSkill && selectedSkill !== "all") queryParams.skill_ids = selectedSkill;
  if (selectedOrganization && selectedOrganization !== "all") queryParams.organization_id = selectedOrganization;
  if (noViolations) queryParams.no_violations = true;
  if (hasAchievements) queryParams.has_achievements = true;

  const { data: students, isLoading, refetch } = useSearchStudents(Object.keys(queryParams).length > 0 ? queryParams : undefined);
  const { data: filterOptions } = useFilterOptions();
  const { data: skills } = useSkills();
  const { data: courses } = useCourses();

  const handleSearch = () => {
    refetch();
  };

  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsProfileOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedYearLevel("");
    setSelectedSkill("");
    setSelectedOrganization("");
    setNoViolations(false);
    setHasAchievements(false);
  };

  const hasActiveFilters = searchTerm || selectedCourse || selectedYearLevel || selectedSkill || selectedOrganization || noViolations || hasAchievements;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" /> Advanced Search
        </h1>
        <p className="text-muted-foreground text-sm">Filter students by skills, grades, violations, achievements, and more</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or student ID..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-9" 
                />
              </div>
              <Button onClick={handleSearch} className="gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                Search
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Course Filter */}
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses?.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Level Filter */}
              <Select value={selectedYearLevel} onValueChange={setSelectedYearLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Year Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Year Levels</SelectItem>
                  {[1, 2, 3, 4, 5].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Skills Filter */}
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills?.map((skill: any) => (
                    <SelectItem key={skill.id} value={skill.id.toString()}>{skill.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Organization Filter */}
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {filterOptions?.organizations?.map((org: any) => (
                    <SelectItem key={org.id} value={org.id.toString()}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle Filters */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={noViolations ? "default" : "outline"} 
                size="sm"
                onClick={() => setNoViolations(!noViolations)}
                className="gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                No Violations
              </Button>
              <Button 
                variant={hasAchievements ? "default" : "outline"} 
                size="sm"
                onClick={() => setHasAchievements(!hasAchievements)}
                className="gap-1"
              >
                <Award className="h-3 w-3" />
                Has Achievements
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Searching..." : `${students?.length || 0} student${students?.length === 1 ? '' : 's'} found`}
        </p>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : students?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No students found matching your criteria</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students?.map((student: any) => (
            <Card key={student.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{student.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.student_id}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {student.course?.name || "N/A"} - {student.year_level}{student.year_level === 1 ? 'st' : student.year_level === 2 ? 'nd' : student.year_level === 3 ? 'rd' : 'th'} Year
                </p>
                
                {/* Skills */}
                {student.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {student.skills.slice(0, 3).map((skill: any) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs">{skill.name}</Badge>
                    ))}
                    {student.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{student.skills.length - 3}</Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span className={student.violations_count === 0 ? "text-green-600" : "text-destructive"}>
                      {student.violations_count || 0} violations
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span className="text-primary font-semibold">
                      {student.achievements_count || 0} achievements
                    </span>
                  </span>
                </div>

                {/* GPA if available */}
                {student.gpa && (
                  <div className="mb-3 p-2 bg-muted rounded text-center">
                    <span className="text-xs text-muted-foreground">GPA: </span>
                    <span className={`font-semibold ${student.gpa <= 2.0 ? 'text-green-600' : student.gpa <= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Number(student.gpa).toFixed(2)}
                    </span>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => handleViewProfile(student.id)}
                >
                  <Eye className="h-3.5 w-3.5" /> View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

export default AdminSearch;
