import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Plus, Edit2, Trash2, BookOpen, Loader2, GraduationCap, 
  CheckCircle, Lightbulb, ChevronDown, ChevronUp
} from "lucide-react";
import { 
  useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse 
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CourseData {
  id: number;
  code: string;
  name: string;
  description: string;
  duration_years: number;
  is_active: boolean;
}

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);
  
  const { toast } = useToast();
  
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  // Form states
  const [courseForm, setCourseForm] = useState({
    code: "",
    name: "",
    description: "",
    duration_years: 4,
    is_active: true,
  });

  const filteredCourses = courses?.filter((course: CourseData) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setCourseForm({
      code: "",
      name: "",
      description: "",
      duration_years: 4,
      is_active: true,
    });
  };

  const handleCreateCourse = async () => {
    try {
      await createCourse.mutateAsync(courseForm);
      toast({ title: "Course created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating course", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    try {
      await updateCourse.mutateAsync({ 
        id: selectedCourse.id, 
        course: courseForm 
      });
      toast({ title: "Course updated successfully" });
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error updating course", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse.mutateAsync(selectedCourse.id);
      toast({ title: "Course deleted successfully" });
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast({ 
        title: "Error deleting course", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (course: CourseData) => {
    setSelectedCourse(course);
    setCourseForm({
      code: course.code,
      name: course.name,
      description: course.description || "",
      duration_years: course.duration_years,
      is_active: course.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (course: CourseData) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BSIT Curriculum Info Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <Collapsible open={isCurriculumOpen} onOpenChange={setIsCurriculumOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">PNC BSIT Curriculum</h2>
                  <p className="text-sm text-muted-foreground">Bachelor of Science in Information Technology</p>
                </div>
              </div>
              {isCurriculumOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Bachelor of Science in Information Technology (BSIT) program at Pamantasan ng Lungsod ng Cabuyao (PNC) 
                  is designed to align with the standards set by CHED while incorporating specialized local institutional requirements.
                </p>
                
                {/* Year Levels */}
                <div className="grid gap-3 md:grid-cols-2">
                  {/* First Year */}
                  <Card className="bg-background/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Badge variant="secondary">1st Year</Badge>
                        Foundations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1 pt-0">
                      <p className="text-muted-foreground">General education and computing basics:</p>
                      <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                        <li>CCS 101: Introduction to Computing</li>
                        <li>CCS 102: Computer Programming 1</li>
                        <li>GEC 004: Mathematics in the Modern World</li>
                        <li>GEC 001: Understanding the Self</li>
                        <li>GEC 002: Readings in Philippine History</li>
                        <li>GEF 001: Kontekstwalisadong Komunikasyon</li>
                        <li>PATHFIT & NSTP</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Second Year */}
                  <Card className="bg-background/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Badge variant="secondary">2nd Year</Badge>
                        Core Programming & Infrastructure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1 pt-0">
                      <p className="text-muted-foreground">Technical and system fundamentals:</p>
                      <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                        <li>Computer Programming 2 & 3 (OOP)</li>
                        <li>Data Structures and Algorithms</li>
                        <li>Information Management (Database)</li>
                        <li>Networking 1 (Protocols & Hardware)</li>
                        <li>Discrete Mathematics</li>
                        <li>Human-Computer Interaction (HCI)</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Third Year */}
                  <Card className="bg-background/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Badge variant="secondary">3rd Year</Badge>
                        Specialization & Systems
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1 pt-0">
                      <p className="text-muted-foreground">Complex applications and security:</p>
                      <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                        <li>Systems Analysis and Design</li>
                        <li>Web Development / E-Commerce</li>
                        <li>Information Assurance and Security</li>
                        <li>System Administration and Maintenance</li>
                        <li>Mobile Application Development</li>
                        <li>Quantitative Methods</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Fourth Year */}
                  <Card className="bg-background/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Badge variant="secondary">4th Year</Badge>
                        Capstone & Industry Immersion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1 pt-0">
                      <p className="text-muted-foreground">Professional readiness and thesis:</p>
                      <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                        <li>Capstone Project 1 & 2</li>
                        <li>Practicum / OJT (486-600 hours)</li>
                        <li>Social and Professional Issues in IT</li>
                        <li>IT Electives (Game Dev, Data Analytics, Cloud)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Tips */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-800">
                      <Lightbulb className="h-4 w-4" />
                      Quick Tips for PNC BSIT Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs pt-0">
                    <ul className="space-y-1 text-amber-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        <span><strong>Prerequisites matter:</strong> Many 3rd-year subjects require passing Computer Programming 2 or Information Management first.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        <span><strong>Certification Tracks:</strong> PNC encourages students to take certification exams (NC II or industry-led certs) alongside these subjects to boost employability.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage courses and their configurations
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Separator />

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Badge variant="secondary">
              {filteredCourses?.length || 0} Courses
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses?.map((course: CourseData) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {course.name}
                      </div>
                    </TableCell>
                    <TableCell>{course.duration_years} years</TableCell>
                    <TableCell>
                      <Badge variant={course.is_active ? "default" : "secondary"}>
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal(course)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteModal(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Course Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  placeholder="e.g., BSIT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={6}
                  value={courseForm.duration_years}
                  onChange={(e) => setCourseForm({ ...courseForm, duration_years: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="e.g., Bachelor of Science in Information Technology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Course description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCourse}
              disabled={!courseForm.code || !courseForm.name || createCourse.isPending}
            >
              {createCourse.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Course Code</Label>
                <Input
                  id="edit-code"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (Years)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min={1}
                  max={6}
                  value={courseForm.duration_years}
                  onChange={(e) => setCourseForm({ ...courseForm, duration_years: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Course Name</Label>
              <Input
                id="edit-name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCourse}
              disabled={updateCourse.isPending}
            >
              {updateCourse.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete <strong>{selectedCourse?.name}</strong>? 
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={deleteCourse.isPending}
            >
              {deleteCourse.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
