import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Plus, Edit2, Trash2, Users, Loader2, UserPlus, Eye 
} from "lucide-react";
import { 
  useSections, useCourses, useCreateSection, useUpdateSection, useDeleteSection, useStudents 
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface SectionData {
  id: number;
  name: string;
  course_id: number;
  course: { id: number; name: string; code: string };
  year_level: number;
  capacity: number;
  academic_year: string;
  is_active: boolean;
  students_count?: number;
}

interface CourseData {
  id: number;
  name: string;
  code: string;
  duration_years: number;
}

const AdminSections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const { toast } = useToast();
  
  const { data: sections, isLoading: sectionsLoading } = useSections();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: sectionStudents, isLoading: studentsLoading } = useStudents(
    isViewModalOpen && selectedSection ? { section_id: selectedSection.id } : null
  );
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();

  // Form states
  const [sectionForm, setSectionForm] = useState({
    name: "",
    course_id: "",
    year_level: 1,
    capacity: 40,
    academic_year: "2024-2025",
    is_active: true,
  });

  // Set default academic year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSectionForm(prev => ({ ...prev, academic_year: `${currentYear}-${currentYear + 1}` }));
  }, []);

  const filteredSections = sections?.filter((section: SectionData) => {
    const matchesSearch = 
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.course?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || section.course_id.toString() === selectedCourse;
    const matchesYear = selectedYearLevel === "all" || section.year_level.toString() === selectedYearLevel;
    return matchesSearch && matchesCourse && matchesYear;
  });

  const resetForm = () => {
    const currentYear = new Date().getFullYear();
    setSectionForm({
      name: "",
      course_id: "",
      year_level: 1,
      capacity: 40,
      academic_year: `${currentYear}-${currentYear + 1}`,
      is_active: true,
    });
  };

  const handleCreateSection = async () => {
    try {
      await createSection.mutateAsync({
        ...sectionForm,
        course_id: parseInt(sectionForm.course_id),
      });
      toast({ title: "Section created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating section", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSection = async () => {
    if (!selectedSection) return;
    try {
      await updateSection.mutateAsync({ 
        id: selectedSection.id, 
        section: sectionForm 
      });
      toast({ title: "Section updated successfully" });
      setIsEditModalOpen(false);
      setSelectedSection(null);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error updating section", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSection) return;
    try {
      await deleteSection.mutateAsync(selectedSection.id);
      toast({ title: "Section deleted successfully" });
      setIsDeleteModalOpen(false);
      setSelectedSection(null);
    } catch (error: any) {
      toast({ 
        title: "Error deleting section", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (section: SectionData) => {
    setSelectedSection(section);
    setSectionForm({
      name: section.name,
      course_id: section.course_id.toString(),
      year_level: section.year_level,
      capacity: section.capacity,
      academic_year: section.academic_year,
      is_active: section.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (section: SectionData) => {
    setSelectedSection(section);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (section: SectionData) => {
    setSelectedSection(section);
    setIsViewModalOpen(true);
  };

  // Get available year levels for selected course
  const getAvailableYearLevels = (courseId: string) => {
    const course = courses?.find((c: CourseData) => c.id.toString() === courseId);
    if (!course) return [1, 2, 3, 4];
    return Array.from({ length: course.duration_years }, (_, i) => i + 1);
  };

  if (sectionsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Section Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage class sections and their capacity
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <Separator />

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses?.map((course: CourseData) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYearLevel} onValueChange={setSelectedYearLevel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Year Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {[1, 2, 3, 4, 5].map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary">
              {filteredSections?.length || 0} Sections
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year Level</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections?.map((section: SectionData) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                        {section.course?.code} {section.year_level}-{section.name}
                      </div>
                    </TableCell>
                    <TableCell>{section.course?.name}</TableCell>
                    <TableCell>Year {section.year_level}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{section.capacity} students</Badge>
                    </TableCell>
                    <TableCell>{section.academic_year}</TableCell>
                    <TableCell>
                      <Badge variant={section.is_active ? "default" : "secondary"}>
                        {section.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openViewModal(section)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal(section)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteModal(section)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSections?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No sections found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Section Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select 
                value={sectionForm.course_id} 
                onValueChange={(value) => setSectionForm({ ...sectionForm, course_id: value, year_level: 1 })}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course: CourseData) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year_level">Year Level</Label>
                <Select 
                  value={sectionForm.year_level.toString()} 
                  onValueChange={(value) => setSectionForm({ ...sectionForm, year_level: parseInt(value) })}
                  disabled={!sectionForm.course_id}
                >
                  <SelectTrigger id="year_level">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableYearLevels(sectionForm.course_id).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section_name">Section Name</Label>
                <Input
                  id="section_name"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={100}
                  value={sectionForm.capacity}
                  onChange={(e) => setSectionForm({ ...sectionForm, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  value={sectionForm.academic_year}
                  onChange={(e) => setSectionForm({ ...sectionForm, academic_year: e.target.value })}
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Section will be named: <strong>
                {sectionForm.course_id && courses?.find((c: CourseData) => c.id.toString() === sectionForm.course_id)?.code} {sectionForm.year_level}-{sectionForm.name}
              </strong>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSection}
              disabled={!sectionForm.name || !sectionForm.course_id || createSection.isPending}
            >
              {createSection.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-year_level">Year Level</Label>
                <Select 
                  value={sectionForm.year_level.toString()} 
                  onValueChange={(value) => setSectionForm({ ...sectionForm, year_level: parseInt(value) })}
                >
                  <SelectTrigger id="edit-year_level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-section_name">Section Name</Label>
                <Input
                  id="edit-section_name"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min={1}
                  max={100}
                  value={sectionForm.capacity}
                  onChange={(e) => setSectionForm({ ...sectionForm, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-academic_year">Academic Year</Label>
                <Input
                  id="edit-academic_year"
                  value={sectionForm.academic_year}
                  onChange={(e) => setSectionForm({ ...sectionForm, academic_year: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSection}
              disabled={updateSection.isPending}
            >
              {updateSection.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Section Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section Details: {selectedSection?.course?.code} {selectedSection?.year_level}-{selectedSection?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Section Info */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="font-medium">{selectedSection?.course?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{sectionStudents?.length || 0} / {selectedSection?.capacity} students</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-medium">{selectedSection?.academic_year}</p>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h4 className="font-semibold mb-2">Students ({sectionStudents?.length || 0})</h4>
              <ScrollArea className="h-[300px]">
                {studentsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : sectionStudents?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectionStudents.map((student: any) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.student_id}</TableCell>
                          <TableCell>{student.user?.name}</TableCell>
                          <TableCell>{student.user?.email}</TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'regular' ? 'default' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No students assigned to this section yet.
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete section <strong>{selectedSection?.course?.code} {selectedSection?.year_level}-{selectedSection?.name}</strong>? 
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteSection}
              disabled={deleteSection.isPending}
            >
              {deleteSection.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSections;
