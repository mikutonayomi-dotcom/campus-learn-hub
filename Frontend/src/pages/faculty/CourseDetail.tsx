import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, FileText, Upload, GraduationCap, Bell, 
  Loader2, Plus, ArrowLeft, Search, Check, Download, 
  Edit, Trash2, ClipboardList
} from "lucide-react";
import { useMyStudents, useMaterials, useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, useCreateMaterial, useUpdateMaterial, useDeleteMaterial, useSubmissions, useGradeSubmission, useAssignments, useCreateAssignment, useUpdateAssignment, useDeleteAssignment, useQuizzes, useCreateQuiz, useUpdateQuiz, useDeleteQuiz, useGrades, useCreateGrade } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const FacultyCourseDetail = () => {
  const navigate = useNavigate();
  const { subjectId, sectionId } = useParams();
  const { data: students, isLoading: studentsLoading } = useMyStudents();
  const { data: materials, isLoading: materialsLoading } = useMaterials({ subject_id: subjectId });
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { data: submissions } = useSubmissions({ subject_id: subjectId });
  const { data: assignments } = useAssignments({ subject_id: subjectId });
  const { data: quizzes } = useQuizzes({ subject_id: subjectId });
  const { data: grades } = useGrades({ subject_id: subjectId });
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const deleteAssignment = useDeleteAssignment();
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  const gradeSubmission = useGradeSubmission();
  const createGrade = useCreateGrade();
  const { toast } = useToast();
  
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isEditAssignmentOpen, setIsEditAssignmentOpen] = useState(false);
  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', target_audience: 'all', priority: 'medium', course_id: '', section_id: '' });
  const [editAnnouncement, setEditAnnouncement] = useState({ id: 0, title: '', content: '', target_audience: 'all', priority: 'medium', course_id: '', section_id: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', file: null as File | null });
  const [editMaterialForm, setEditMaterialForm] = useState({ id: 0, title: '', description: '' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', instructions: '', deadline: '', max_points: 100 });
  const [editAssignmentForm, setEditAssignmentForm] = useState({ id: 0, title: '', description: '', instructions: '', deadline: '', max_points: 100 });
  const [quizForm, setQuizForm] = useState({ title: '', description: '', duration: 30, passing_score: 60 });
  const [editQuizForm, setEditQuizForm] = useState({ id: 0, title: '', description: '', duration: 30, passing_score: 60 });
  const [gradingForm, setGradingForm] = useState<Record<number, { grade: number; feedback: string }>>({});

  const isLoading = studentsLoading || materialsLoading || announcementsLoading;

  const handleCreateAnnouncement = () => {
    createAnnouncement.mutate({
      ...newAnnouncement,
      course_id: newAnnouncement.course_id ? parseInt(newAnnouncement.course_id) : null,
      section_id: newAnnouncement.section_id ? parseInt(newAnnouncement.section_id) : null,
    }, {
      onSuccess: () => {
        setIsCreateAnnouncementOpen(false);
        setNewAnnouncement({ title: '', content: '', target_audience: 'all', priority: 'medium', course_id: '', section_id: '' });
        toast({ title: "Announcement posted successfully" });
      },
    });
  };

  const handleEditAnnouncement = () => {
    updateAnnouncement.mutate({
      id: editAnnouncement.id,
      announcement: {
        ...editAnnouncement,
        course_id: editAnnouncement.course_id ? parseInt(editAnnouncement.course_id) : null,
        section_id: editAnnouncement.section_id ? parseInt(editAnnouncement.section_id) : null,
      }
    }, {
      onSuccess: () => {
        setIsEditAnnouncementOpen(false);
        setEditAnnouncement({ id: 0, title: '', content: '', target_audience: 'all', priority: 'medium', course_id: '', section_id: '' });
        toast({ title: "Announcement updated successfully" });
      },
    });
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement.mutate(id, {
        onSuccess: () => {
          toast({ title: "Announcement deleted successfully" });
        },
      });
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await createAssignment.mutateAsync({
        subject_id: parseInt(subjectId || '0'),
        title: assignmentForm.title,
        description: assignmentForm.description,
        instructions: assignmentForm.instructions,
        deadline: assignmentForm.deadline || null,
        max_points: assignmentForm.max_points,
      });
      toast({ title: "Assignment created successfully" });
      setIsCreateAssignmentOpen(false);
      setAssignmentForm({ title: '', description: '', instructions: '', deadline: '', max_points: 100 });
    } catch (error) {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    }
  };

  const handleEditAssignment = async () => {
    try {
      await updateAssignment.mutateAsync({
        id: editAssignmentForm.id,
        assignment: {
          title: editAssignmentForm.title,
          description: editAssignmentForm.description,
          instructions: editAssignmentForm.instructions,
          deadline: editAssignmentForm.deadline || null,
          max_points: editAssignmentForm.max_points,
        }
      });
      toast({ title: "Assignment updated successfully" });
      setIsEditAssignmentOpen(false);
      setEditAssignmentForm({ id: 0, title: '', description: '', instructions: '', deadline: '', max_points: 100 });
    } catch (error) {
      toast({ title: "Failed to update assignment", variant: "destructive" });
    }
  };

  const handleDeleteAssignment = (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignment.mutate(id, {
        onSuccess: () => {
          toast({ title: "Assignment deleted successfully" });
        },
      });
    }
  };

  const handleUploadMaterial = async () => {
    if (!materialForm.file) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', materialForm.file);
    formData.append('title', materialForm.title);
    formData.append('description', materialForm.description);
    formData.append('subject_id', subjectId || '');
    
    try {
      await createMaterial.mutateAsync(formData);
      toast({ title: "Material uploaded successfully" });
      setIsUploadMaterialOpen(false);
      setMaterialForm({ title: '', description: '', file: null });
    } catch (error) {
      toast({ title: "Failed to upload material", variant: "destructive" });
    }
  };

  const handleEditMaterial = async () => {
    try {
      await updateMaterial.mutateAsync({
        id: editMaterialForm.id,
        material: {
          title: editMaterialForm.title,
          description: editMaterialForm.description,
        }
      });
      toast({ title: "Material updated successfully" });
      setIsEditMaterialOpen(false);
      setEditMaterialForm({ id: 0, title: '', description: '' });
    } catch (error) {
      toast({ title: "Failed to update material", variant: "destructive" });
    }
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm('Are you sure you want to delete this material?')) {
      deleteMaterial.mutate(id, {
        onSuccess: () => {
          toast({ title: "Material deleted successfully" });
        },
      });
    }
  };

  const handleGrade = async (submissionId: number) => {
    const grading = gradingForm[submissionId];
    if (!grading || grading.grade === undefined) {
      toast({ title: "Please enter a grade", variant: "destructive" });
      return;
    }
    
    try {
      await gradeSubmission.mutateAsync({ id: submissionId, grade: grading.grade, feedback: grading.feedback });
      toast({ title: "Grade submitted successfully" });
      delete gradingForm[submissionId];
    } catch (error) {
      toast({ title: "Failed to submit grade", variant: "destructive" });
    }
  };

  const handleCreateQuiz = async () => {
    try {
      await createQuiz.mutateAsync({
        subject_id: parseInt(subjectId || '0'),
        title: quizForm.title,
        description: quizForm.description,
        duration: quizForm.duration,
        passing_score: quizForm.passing_score,
      });
      toast({ title: "Quiz created successfully" });
      setIsCreateQuizOpen(false);
      setQuizForm({ title: '', description: '', duration: 30, passing_score: 60 });
    } catch (error) {
      toast({ title: "Failed to create quiz", variant: "destructive" });
    }
  };

  const handleEditQuiz = async () => {
    try {
      await updateQuiz.mutateAsync({
        id: editQuizForm.id,
        quiz: {
          title: editQuizForm.title,
          description: editQuizForm.description,
          duration: editQuizForm.duration,
          passing_score: editQuizForm.passing_score,
        }
      });
      toast({ title: "Quiz updated successfully" });
      setIsEditQuizOpen(false);
      setEditQuizForm({ id: 0, title: '', description: '', duration: 30, passing_score: 60 });
    } catch (error) {
      toast({ title: "Failed to update quiz", variant: "destructive" });
    }
  };

  const handleDeleteQuiz = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz.mutate(id, {
        onSuccess: () => {
          toast({ title: "Quiz deleted successfully" });
        },
      });
    }
  };

  const handleSaveGrade = async (studentId: number, grade: number) => {
    try {
      await createGrade.mutateAsync({
        student_id: studentId,
        subject_id: parseInt(subjectId || '0'),
        score: grade,
      });
      toast({ title: "Grade saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save grade", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredStudents = students?.filter((s: any) => 
    s.section?.id === parseInt(sectionId || '0')
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/faculty/courses')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Class Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Subject ID: {subjectId} • Section ID: {sectionId}
          </p>
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Students in this Section</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {student.user?.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-medium">{student.user?.name}</p>
                          <p className="text-sm text-muted-foreground">{student.student_id}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{student.course?.name}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No students in this section</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Learning Materials</CardTitle>
                <Dialog open={isUploadMaterialOpen} onOpenChange={setIsUploadMaterialOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Material</DialogTitle>
                      <DialogDescription>
                        Upload learning materials for your students.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={materialForm.title}
                          onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                          placeholder="Material title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={materialForm.description}
                          onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                          placeholder="Material description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>File</Label>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                          onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files?.[0] || null })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUploadMaterialOpen(false)}>Cancel</Button>
                      <Button onClick={handleUploadMaterial} disabled={createMaterial.isPending}>
                        {createMaterial.isPending ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {materials && materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((material: any) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{material.title}</h3>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setEditMaterialForm({ id: material.id, title: material.title, description: material.description });
                                  setIsEditMaterialOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => handleDeleteMaterial(material.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {material.description}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No materials uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Assignments</CardTitle>
                <Dialog open={isCreateAssignmentOpen} onOpenChange={setIsCreateAssignmentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Assignment</DialogTitle>
                      <DialogDescription>
                        Create a new assignment for your students.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                          placeholder="Assignment title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                          placeholder="Assignment description"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          value={assignmentForm.instructions}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                          placeholder="Assignment instructions"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deadline</Label>
                        <Input
                          type="datetime-local"
                          value={assignmentForm.deadline}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Points</Label>
                        <Input
                          type="number"
                          value={assignmentForm.max_points}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, max_points: parseInt(e.target.value) || 100 })}
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateAssignmentOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAssignment} disabled={createAssignment.isPending}>
                        {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {assignments && assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment: any) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{assignment.max_points} points</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditAssignmentForm({ 
                                id: assignment.id, 
                                title: assignment.title, 
                                description: assignment.description,
                                instructions: assignment.instructions || '',
                                deadline: assignment.deadline || '',
                                max_points: assignment.max_points 
                              });
                              setIsEditAssignmentOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                      {assignment.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Deadline: {new Date(assignment.deadline).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No assignments created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Student Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student: any) => {
                    const studentGrade = grades?.find((g: any) => g.student_id === student.id);
                    return (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {student.user?.name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="font-medium">{student.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{student.student_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="w-20"
                            max="100"
                            defaultValue={studentGrade?.score || ''}
                            onBlur={(e) => {
                              const grade = parseInt(e.target.value);
                              if (grade >= 0 && grade <= 100) {
                                handleSaveGrade(student.id, grade);
                              }
                            }}
                          />
                          <span className="text-sm text-muted-foreground">/100</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No students to grade</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Quizzes</CardTitle>
                <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Quiz</DialogTitle>
                      <DialogDescription>
                        Create a new quiz for your students.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={quizForm.title}
                          onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                          placeholder="Quiz title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={quizForm.description}
                          onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                          placeholder="Quiz description"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={quizForm.duration}
                            onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) || 30 })}
                            placeholder="30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Passing Score (%)</Label>
                          <Input
                            type="number"
                            value={quizForm.passing_score}
                            onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) || 60 })}
                            placeholder="60"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateQuizOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateQuiz} disabled={createQuiz.isPending}>
                        {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {quizzes && quizzes.length > 0 ? (
                <div className="space-y-4">
                  {quizzes.map((quiz: any) => (
                    <div key={quiz.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{quiz.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{quiz.duration} min</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditQuizForm({ 
                                id: quiz.id, 
                                title: quiz.title, 
                                description: quiz.description,
                                duration: quiz.duration,
                                passing_score: quiz.passing_score 
                              });
                              setIsEditQuizOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Passing Score: {quiz.passing_score}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No quizzes created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission: any) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{submission.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {submission.student?.user?.name} • {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={submission.grade ? 'default' : 'secondary'}>
                          {submission.grade ? `Graded: ${submission.grade}` : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{submission.description}</p>
                      {submission.file_path && (
                        <Button variant="outline" size="sm" className="mb-3">
                          <Download className="h-4 w-4 mr-2" />
                          Download File
                        </Button>
                      )}
                      {!submission.grade && (
                        <div className="border-t pt-3 mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Grade (0-100)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={gradingForm[submission.id]?.grade || ''}
                                onChange={(e) => setGradingForm({
                                  ...gradingForm,
                                  [submission.id]: { ...gradingForm[submission.id], grade: parseInt(e.target.value) }
                                })}
                                placeholder="Enter grade"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Feedback</Label>
                              <Input
                                value={gradingForm[submission.id]?.feedback || ''}
                                onChange={(e) => setGradingForm({
                                  ...gradingForm,
                                  [submission.id]: { ...gradingForm[submission.id], feedback: e.target.value }
                                })}
                                placeholder="Feedback (optional)"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleGrade(submission.id)}
                            disabled={gradeSubmission.isPending}
                            className="mt-3"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Submit Grade
                          </Button>
                        </div>
                      )}
                      {submission.feedback && (
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm"><strong>Feedback:</strong> {submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No submissions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Announcements</CardTitle>
                <Dialog open={isCreateAnnouncementOpen} onOpenChange={setIsCreateAnnouncementOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                      <DialogDescription>Post a new announcement for your students</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          placeholder="Announcement title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          placeholder="Announcement content"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="course_id">Target Course (Optional)</Label>
                        <Input
                          id="course_id"
                          type="number"
                          value={newAnnouncement.course_id}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, course_id: e.target.value })}
                          placeholder="Course ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="section_id">Target Section (Optional)</Label>
                        <Input
                          id="section_id"
                          type="number"
                          value={newAnnouncement.section_id}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, section_id: e.target.value })}
                          placeholder="Section ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          value={newAnnouncement.priority}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateAnnouncementOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAnnouncement} disabled={createAnnouncement.isPending}>
                        {createAnnouncement.isPending ? 'Posting...' : 'Post Announcement'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}>
                            {announcement.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditAnnouncement({ 
                                id: announcement.id, 
                                title: announcement.title, 
                                content: announcement.content,
                                target_audience: announcement.target_audience || 'all',
                                priority: announcement.priority || 'medium',
                                course_id: announcement.course_id?.toString() || '',
                                section_id: announcement.section_id?.toString() || ''
                              });
                              setIsEditAnnouncementOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        Posted by {announcement.author?.name} on {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No announcements posted yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Material Dialog */}
      <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update material details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editMaterialForm.title}
                onChange={(e) => setEditMaterialForm({ ...editMaterialForm, title: e.target.value })}
                placeholder="Material title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editMaterialForm.description}
                onChange={(e) => setEditMaterialForm({ ...editMaterialForm, description: e.target.value })}
                placeholder="Material description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMaterialOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMaterial} disabled={updateMaterial.isPending}>
              {updateMaterial.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditAssignmentOpen} onOpenChange={setIsEditAssignmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Update assignment details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editAssignmentForm.title}
                onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, title: e.target.value })}
                placeholder="Assignment title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editAssignmentForm.description}
                onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, description: e.target.value })}
                placeholder="Assignment description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={editAssignmentForm.instructions}
                onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, instructions: e.target.value })}
                placeholder="Assignment instructions"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="datetime-local"
                value={editAssignmentForm.deadline}
                onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Points</Label>
              <Input
                type="number"
                value={editAssignmentForm.max_points}
                onChange={(e) => setEditAssignmentForm({ ...editAssignmentForm, max_points: parseInt(e.target.value) || 100 })}
                placeholder="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAssignmentOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAssignment} disabled={updateAssignment.isPending}>
              {updateAssignment.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Dialog */}
      <Dialog open={isEditQuizOpen} onOpenChange={setIsEditQuizOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>Update quiz details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editQuizForm.title}
                onChange={(e) => setEditQuizForm({ ...editQuizForm, title: e.target.value })}
                placeholder="Quiz title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editQuizForm.description}
                onChange={(e) => setEditQuizForm({ ...editQuizForm, description: e.target.value })}
                placeholder="Quiz description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={editQuizForm.duration}
                  onChange={(e) => setEditQuizForm({ ...editQuizForm, duration: parseInt(e.target.value) || 30 })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={editQuizForm.passing_score}
                  onChange={(e) => setEditQuizForm({ ...editQuizForm, passing_score: parseInt(e.target.value) || 60 })}
                  placeholder="60"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditQuizOpen(false)}>Cancel</Button>
            <Button onClick={handleEditQuiz} disabled={updateQuiz.isPending}>
              {updateQuiz.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update announcement details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">Title</Label>
              <Input
                id="edit_title"
                value={editAnnouncement.title}
                onChange={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div>
              <Label htmlFor="edit_content">Content</Label>
              <Textarea
                id="edit_content"
                value={editAnnouncement.content}
                onChange={(e) => setEditAnnouncement({ ...editAnnouncement, content: e.target.value })}
                placeholder="Announcement content"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit_course_id">Target Course (Optional)</Label>
              <Input
                id="edit_course_id"
                type="number"
                value={editAnnouncement.course_id}
                onChange={(e) => setEditAnnouncement({ ...editAnnouncement, course_id: e.target.value })}
                placeholder="Course ID"
              />
            </div>
            <div>
              <Label htmlFor="edit_section_id">Target Section (Optional)</Label>
              <Input
                id="edit_section_id"
                type="number"
                value={editAnnouncement.section_id}
                onChange={(e) => setEditAnnouncement({ ...editAnnouncement, section_id: e.target.value })}
                placeholder="Section ID"
              />
            </div>
            <div>
              <Label htmlFor="edit_priority">Priority</Label>
              <select
                id="edit_priority"
                value={editAnnouncement.priority}
                onChange={(e) => setEditAnnouncement({ ...editAnnouncement, priority: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAnnouncementOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAnnouncement} disabled={updateAnnouncement.isPending}>
              {updateAnnouncement.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyCourseDetail;
