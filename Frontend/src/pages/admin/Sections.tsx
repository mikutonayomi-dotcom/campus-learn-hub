import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Plus, Edit2, Trash2, Users, 
  Loader2, Eye
} from "lucide-react";
import { 
  useSections, useCreateSection, useUpdateSection, useDeleteSection, useCourses, useSectionStudents
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const SectionViewModal = ({ section }: { section: SectionData | null }) => {
  const { data: sectionData, isLoading } = useSectionStudents(section?.id || 0);

  if (!section) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Section Name</Label>
          <p className="font-medium">{section.name}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Course</Label>
          <p className="font-medium">{section.course?.name || "-"}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Year Level</Label>
          <p className="font-medium">{section.year_level}{section.year_level === 1 ? 'st' : section.year_level === 2 ? 'nd' : section.year_level === 3 ? 'rd' : 'th'} Year</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Semester</Label>
          <p className="font-medium">{section.semester}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Capacity</Label>
          <p className="font-medium">{section.students_count || 0} / {section.capacity}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Available Slots</Label>
          <p className="font-medium">{section.capacity - (section.students_count || 0)}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Academic Year</Label>
          <p className="font-medium">{section.academic_year}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Status</Label>
          <Badge variant={section.is_active ? "default" : "secondary"} className="capitalize">
            {section.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Enrolled Students ({sectionData?.student_count || 0})</h3>
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : sectionData?.students && sectionData.students.length > 0 ? (
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionData.students.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.student_id}</TableCell>
                    <TableCell>{student.user?.name || "-"}</TableCell>
                    <TableCell>{student.course?.name || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">No students enrolled in this section</p>
        )}
      </div>
    </div>
  );
};

interface SectionData {
  id: number;
  name: string;
  course_id: number;
  course: { id: number; name: string } | null;
  year_level: number;
  semester: string;
  capacity: number;
  academic_year: string;
  is_active: boolean;
  created_at: string;
  students_count?: number;
}

const Sections = () => {
  const { data: sections, isLoading } = useSections();
  const { data: courses } = useCourses();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);

  const [newSectionForm, setNewSectionForm] = useState({
    name: "",
    course_id: "1",
    year_level: "1",
    semester: "1st",
    capacity: "45",
    academic_year: "2026-2027",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    course_id: "",
    year_level: "",
    semester: "",
    capacity: "",
    academic_year: "",
    is_active: true,
  });

  const resetForm = () => {
    setNewSectionForm({
      name: "",
      course_id: "",
      year_level: "1",
      semester: "1st",
      capacity: "45",
      academic_year: "2026-2027",
    });
  };

  const handleCreateSection = async () => {
    try {
      await createSection.mutateAsync({
        name: newSectionForm.name,
        course_id: parseInt(newSectionForm.course_id),
        year_level: parseInt(newSectionForm.year_level),
        semester: newSectionForm.semester,
        capacity: parseInt(newSectionForm.capacity),
        academic_year: newSectionForm.academic_year,
      });
      toast({ title: "Section created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating section", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEditClick = (section: SectionData) => {
    setSelectedSection(section);
    setEditForm({
      name: section.name,
      course_id: section.course_id.toString(),
      year_level: section.year_level.toString(),
      semester: section.semester,
      capacity: section.capacity.toString(),
      academic_year: section.academic_year,
      is_active: section.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (section: SectionData) => {
    setSelectedSection(section);
    setIsViewModalOpen(true);
  };

  const handleUpdateSection = async () => {
    if (!selectedSection) return;
    
    try {
      await updateSection.mutateAsync({
        id: selectedSection.id,
        section: {
          name: editForm.name,
          course_id: parseInt(editForm.course_id),
          year_level: parseInt(editForm.year_level),
          semester: editForm.semester,
          capacity: parseInt(editForm.capacity),
          academic_year: editForm.academic_year,
          is_active: editForm.is_active,
        }
      });
      toast({ title: "Section updated successfully" });
      setIsEditModalOpen(false);
      setSelectedSection(null);
    } catch (error: any) {
      toast({ 
        title: "Error updating section", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteSection = async (section: SectionData) => {
    if (!confirm(`Are you sure you want to delete ${section.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteSection.mutateAsync(section.id);
      toast({ title: "Section deleted successfully" });
    } catch (error: any) {
      toast({ 
        title: "Error deleting section", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const filteredSections = sections?.filter((section: SectionData) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.academic_year.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Section Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage sections and their capacity</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
              <DialogDescription>Create a new section for the BSIT program</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section_name">Section Name</Label>
                  <Input
                    id="section_name"
                    value={newSectionForm.name}
                    onChange={(e) => setNewSectionForm({ ...newSectionForm, name: e.target.value })}
                    placeholder="e.g., BSIT-1A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select 
                    value={newSectionForm.course_id} 
                    onValueChange={(value) => setNewSectionForm({ ...newSectionForm, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year_level">Year Level</Label>
                    <Select 
                      value={newSectionForm.year_level} 
                      onValueChange={(value) => setNewSectionForm({ ...newSectionForm, year_level: value })}
                    >
                      <SelectTrigger>
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
                      value={newSectionForm.semester} 
                      onValueChange={(value) => setNewSectionForm({ ...newSectionForm, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Semester</SelectItem>
                        <SelectItem value="2nd">2nd Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="100"
                      value={newSectionForm.capacity}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, capacity: e.target.value })}
                      placeholder="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic_year">Academic Year</Label>
                    <Input
                      id="academic_year"
                      value={newSectionForm.academic_year}
                      onChange={(e) => setNewSectionForm({ ...newSectionForm, academic_year: e.target.value })}
                      placeholder="2026-2027"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateSection} disabled={createSection.isPending}>
                {createSection.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Create Section"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
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
                <TableHead>Section Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No sections found</TableCell>
                </TableRow>
              ) : (
                filteredSections.map((section: SectionData) => (
                  <TableRow key={section.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-medium">{section.name}</TableCell>
                    <TableCell>{section.course?.name || "-"}</TableCell>
                    <TableCell>{section.year_level}{section.year_level === 1 ? 'st' : section.year_level === 2 ? 'nd' : section.year_level === 3 ? 'rd' : 'th'} Year</TableCell>
                    <TableCell>{section.semester}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{section.students_count || 0} / {section.capacity}</span>
                        </div>
                        <Badge variant={section.capacity - (section.students_count || 0) > 0 ? "outline" : "destructive"} className="text-xs w-fit">
                          {section.capacity - (section.students_count || 0)} remaining
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{section.academic_year}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(section.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={section.is_active ? "default" : "secondary"} className="capitalize">
                        {section.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewClick(section)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(section)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteSection(section)}
                          disabled={deleteSection.isPending}
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

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Section Details</DialogTitle>
            <DialogDescription>View section information and enrolled students</DialogDescription>
          </DialogHeader>
          <SectionViewModal section={selectedSection} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>Update the section information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_section_name">Section Name</Label>
                <Input
                  id="edit_section_name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., BSIT-1A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_course">Course</Label>
                <Select 
                  value={editForm.course_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, course_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course: any) => (
                      <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_year_level">Year Level</Label>
                  <Select 
                    value={editForm.year_level} 
                    onValueChange={(value) => setEditForm({ ...editForm, year_level: value })}
                  >
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Semester</SelectItem>
                      <SelectItem value="2nd">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_capacity">Capacity</Label>
                  <Input
                    id="edit_capacity"
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                    placeholder="40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_academic_year">Academic Year</Label>
                  <Input
                    id="edit_academic_year"
                    value={editForm.academic_year}
                    onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })}
                    placeholder="2026-2027"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="edit_is_active">Active Status</Label>
                <Select 
                  value={editForm.is_active ? "true" : "false"} 
                  onValueChange={(value) => setEditForm({ ...editForm, is_active: value === "true" })}
                >
                  <SelectTrigger className="w-32">
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
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedSection(null); }}>Cancel</Button>
            <Button onClick={handleUpdateSection} disabled={updateSection.isPending}>
              {updateSection.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sections;
