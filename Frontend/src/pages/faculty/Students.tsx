import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Search, Loader2, Filter, X } from "lucide-react";
import { useMyStudents, useSkills } from "@/hooks/useApi";

const FacultyStudents = () => {
  const { data: students, isLoading } = useMyStudents();
  const { data: skills } = useSkills();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterSection, setFilterSection] = useState("");
  const [filterSkillIds, setFilterSkillIds] = useState<number[]>([]);

  const filteredStudents = students?.filter((student: any) => {
    const matchesSearch = 
      student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = !filterSection || student.section_id === parseInt(filterSection);
    
    const matchesSkills = filterSkillIds.length === 0 || 
      student.skills?.some((skill: any) => filterSkillIds.includes(skill.id));

    return matchesSearch && matchesSection && matchesSkills;
  }) || [];

  const clearFilters = () => {
    setFilterSection("");
    setFilterSkillIds([]);
  };

  const hasActiveFilters = filterSection || filterSkillIds.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Get unique sections from students
  const sections = students?.reduce((acc: any[], student: any) => {
    if (student.section && !acc.find((s: any) => s.id === student.section.id)) {
      acc.push(student.section);
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground text-sm">
            View students from your assigned sections
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">Active</Badge>}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={filterSection || "all"} onValueChange={(value) => setFilterSection(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {sections.map((section: any) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name} - Year {section.year_level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>
          </CardContent>
        </Card>
      )}

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student: any) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {student.user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{student.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.student_id}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{student.course?.name}</Badge>
                      <Badge variant="secondary" className="text-xs">{student.section?.name}</Badge>
                    </div>
                    {student.skills && student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.skills.slice(0, 2).map((skill: any) => (
                          <Badge key={skill.id} variant="outline" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {student.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm || hasActiveFilters ? 'Try adjusting your search or filters' : 'No students assigned to your sections yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultyStudents;
