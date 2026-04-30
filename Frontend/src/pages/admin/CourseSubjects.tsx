import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Plus, Edit2, Trash2, 
  Loader2
} from "lucide-react";
import { 
  useCourseSubjects, useCreateCourseSubject, useUpdateCourseSubject, useDeleteCourseSubject,
  useSubjects, useCourses
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface CourseSubjectData {
  id: number;
  course_id: number;
  subject_id: number;
  course: { id: number; name: string; code: string } | null;
  subject: { id: number; name: string; code: string; units: number } | null;
  year_level: number;
  semester: number;
  is_active: boolean;
  created_at: string;
}

const CourseSubjects = () => {
  const { data: courseSubjects, isLoading } = useCourseSubjects();
  const { data: subjects } = useSubjects();
  const { data: courses } = useCourses();
  const createCourseSubject = useCreateCourseSubject();
  const updateCourseSubject = useUpdateCourseSubject();
  const deleteCourseSubject = useDeleteCourseSubject();
  const { toast } = useToast();

  // Use courses in the component
  console.log('Courses loaded:', courses?.length);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseSubject, setSelectedCourseSubject] = useState<CourseSubjectData | null>(null);

  const [newCourseSubjectForm, setNewCourseSubjectForm] = useState({
    course_id: "1",
    subject_id: "",
    year_level: "1",
    semester: "1",
  });

  const [editForm, setEditForm] = useState({
    year_level: "",
    semester: "",
    is_active: true,
  });

  const resetForm = () => {
    setNewCourseSubjectForm({
      course_id: "1",
      subject_id: "",
      year_level: "1",
      semester: "1",
    });
  };

  const handleCreateCourseSubject = async () => {
    try {
      await createCourseSubject.mutateAsync({
        course_id: parseInt(newCourseSubjectForm.course_id),
        subject_id: parseInt(newCourseSubjectForm.subject_id),
        year_level: parseInt(newCourseSubjectForm.year_level),
        semester: parseInt(newCourseSubjectForm.semester),
      });
      toast({ title: "Course subject added successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error adding course subject", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEditClick = (courseSubject: CourseSubjectData) => {
    setSelectedCourseSubject(courseSubject);
    setEditForm({
      year_level: courseSubject.year_level.toString(),
      semester: courseSubject.semester.toString(),
      is_active: courseSubject.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourseSubject = async () => {
    if (!selectedCourseSubject) return;
    
    try {
      await updateCourseSubject.mutateAsync({
        id: selectedCourseSubject.id,
        courseSubject: {
          year_level: parseInt(editForm.year_level),
          semester: parseInt(editForm.semester),
          is_active: editForm.is_active,
        }
      });
      toast({ title: "Course subject updated successfully" });
      setIsEditModalOpen(false);
      setSelectedCourseSubject(null);
    } catch (error: any) {
      toast({ 
        title: "Error updating course subject", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteCourseSubject = async (courseSubject: CourseSubjectData) => {
    if (!confirm(`Are you sure you want to remove ${courseSubject.subject?.name} from ${courseSubject.course?.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCourseSubject.mutateAsync(courseSubject.id);
      toast({ title: "Course subject removed successfully" });
    } catch (error: any) {
      toast({ 
        title: "Error removing course subject", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const filteredCourseSubjects = courseSubjects?.filter((cs: CourseSubjectData) =>
    cs.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.subject?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.course?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Course/Subject Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage subjects assigned to courses</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject to Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Subject to Course</DialogTitle>
              <DialogDescription>Assign a subject to a course with year level and semester</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value="Bachelor of Science in Information Technology"
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={newCourseSubjectForm.subject_id} 
                    onValueChange={(value) => setNewCourseSubjectForm({ ...newCourseSubjectForm, subject_id: value })}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.code} - {subject.name} ({subject.units} units)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year_level">Year Level</Label>
                    <Select 
                      value={newCourseSubjectForm.year_level} 
                      onValueChange={(value) => setNewCourseSubjectForm({ ...newCourseSubjectForm, year_level: value })}
                    >
                      <SelectTrigger id="year_level">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select 
                      value={newCourseSubjectForm.semester} 
                      onValueChange={(value) => setNewCourseSubjectForm({ ...newCourseSubjectForm, semester: value })}
                    >
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateCourseSubject} disabled={createCourseSubject.isPending}>
                {createCourseSubject.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</> : "Add Subject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-subjects"
            name="search-subjects"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourseSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No course subjects found</TableCell>
                </TableRow>
              ) : (
                filteredCourseSubjects.map((cs: CourseSubjectData) => (
                  <TableRow key={cs.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{cs.subject?.code || "-"}</TableCell>
                    <TableCell className="font-medium">{cs.subject?.name || "-"}</TableCell>
                    <TableCell>{cs.course?.name || "-"}</TableCell>
                    <TableCell>{cs.subject?.units || 0}</TableCell>
                    <TableCell>{cs.year_level}{cs.year_level === 1 ? 'st' : cs.year_level === 2 ? 'nd' : cs.year_level === 3 ? 'rd' : 'th'} Year</TableCell>
                    <TableCell>{cs.semester === 1 ? '1st' : '2nd'} Semester</TableCell>
                    <TableCell>
                      <Badge variant={cs.is_active ? "default" : "secondary"} className="capitalize">
                        {cs.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(cs)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCourseSubject(cs)}
                          disabled={deleteCourseSubject.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Course Subject</DialogTitle>
            <DialogDescription>Update the course subject assignment</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_subject">Subject</Label>
                <Input
                  id="edit_subject"
                  name="edit_subject"
                  value={selectedCourseSubject?.subject?.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_course">Course</Label>
                <Input
                  id="edit_course"
                  name="edit_course"
                  value={selectedCourseSubject?.course?.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_year_level">Year Level</Label>
                  <Select 
                    value={editForm.year_level} 
                    onValueChange={(value) => setEditForm({ ...editForm, year_level: value })}
                  >
                    <SelectTrigger id="edit_year_level">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_semester">Semester</Label>
                  <Select 
                    value={editForm.semester} 
                    onValueChange={(value) => setEditForm({ ...editForm, semester: value })}
                  >
                    <SelectTrigger id="edit_semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit_is_active">Active Status</Label>
                <Select 
                  value={editForm.is_active ? "true" : "false"} 
                  onValueChange={(value) => setEditForm({ ...editForm, is_active: value === "true" })}
                >
                  <SelectTrigger id="edit_is_active" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedCourseSubject(null); }}>Cancel</Button>
            <Button onClick={handleUpdateCourseSubject} disabled={updateCourseSubject.isPending}>
              {updateCourseSubject.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseSubjects;
