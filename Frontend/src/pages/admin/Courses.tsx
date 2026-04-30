import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface CourseData {
  id: number;
  code: string;
  name: string;
  description: string | null;
  duration_years: number;
  is_active: boolean;
  subjects_count?: number;
  students_count?: number;
  sections_count?: number;
}

const Courses = () => {
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  const [newCourseForm, setNewCourseForm] = useState({
    code: "",
    name: "",
    description: "",
    duration_years: "4",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    duration_years: "",
    is_active: true,
  });

  const resetForm = () => {
    setNewCourseForm({
      code: "",
      name: "",
      description: "",
      duration_years: "4",
    });
  };

  const handleCreateCourse = async () => {
    try {
      await createCourse.mutateAsync({
        code: newCourseForm.code,
        name: newCourseForm.name,
        description: newCourseForm.description,
        duration_years: parseInt(newCourseForm.duration_years),
      });
      toast({ title: "Course created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error creating course",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (course: CourseData) => {
    setSelectedCourse(course);
    setEditForm({
      name: course.name,
      description: course.description || "",
      duration_years: course.duration_years.toString(),
      is_active: course.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;

    try {
      await updateCourse.mutateAsync({
        id: selectedCourse.id,
        course: {
          name: editForm.name,
          description: editForm.description,
          duration_years: parseInt(editForm.duration_years),
          is_active: editForm.is_active,
        },
      });
      toast({ title: "Course updated successfully" });
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast({
        title: "Error updating course",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (course: CourseData) => {
    if (!confirm(`Are you sure you want to delete ${course.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCourse.mutateAsync(course.id);
      toast({ title: "Course deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting course",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const filteredCourses = courses?.filter(
    (course: CourseData) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage academic courses and programs</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Course</DialogTitle>
              <DialogDescription>Create a new academic course or program</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    placeholder="e.g., BSIT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={newCourseForm.name}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                    placeholder="e.g., Bachelor of Science in Information Technology"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCourseForm.description}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                    placeholder="Course description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_years">Duration (Years)</Label>
                  <Select
                    value={newCourseForm.duration_years}
                    onValueChange={(value) => setNewCourseForm({ ...newCourseForm, duration_years: value })}
                  >
                    <SelectTrigger id="duration_years">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === 1 ? "Year" : "Years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={createCourse.isPending}>
                {createCourse.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</> : "Add Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No courses found</TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course: CourseData) => (
                  <TableRow key={course.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{course.code}</TableCell>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.duration_years} {course.duration_years === 1 ? "Year" : "Years"}</TableCell>
                    <TableCell>{course.subjects_count || 0}</TableCell>
                    <TableCell>{course.students_count || 0}</TableCell>
                    <TableCell>{course.sections_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={course.is_active ? "default" : "secondary"} className="capitalize">
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(course)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCourse(course)}
                          disabled={deleteCourse.isPending}
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
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_code">Course Code</Label>
                <Input id="edit_code" value={selectedCourse?.code || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_name">Course Name</Label>
                <Input
                  id="edit_name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_duration_years">Duration (Years)</Label>
                <Select
                  value={editForm.duration_years}
                  onValueChange={(value) => setEditForm({ ...editForm, duration_years: value })}
                >
                  <SelectTrigger id="edit_duration_years">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} {year === 1 ? "Year" : "Years"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedCourse(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse} disabled={updateCourse.isPending}>
              {updateCourse.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
