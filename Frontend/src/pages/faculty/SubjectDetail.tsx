import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, FileText, ArrowLeft, 
  Loader2, Clock, MapPin, Upload,
  Megaphone, Plus, Trash2, Users
} from "lucide-react";
import { 
  useSubjects, 
  useMaterials, 
  useAssignments, 
  useAnnouncements,
  useCreateMaterial,
  useCreateAssignment,
  useCreateAnnouncement,
  useDeleteMaterial,
  useDeleteAssignment,
  useDeleteAnnouncement,
  useSubmissionsToGrade,
  useGradeSubmission
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const FacultySubjectDetail = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { data: subject, isLoading } = useSubjects({ id: subjectId });
  const { data: materials } = useMaterials({ subject_id: subjectId });
  const { data: assignments } = useAssignments({ subject_id: subjectId });
  const { data: announcements } = useAnnouncements({ subject_id: subjectId });
  const { data: submissions } = useSubmissionsToGrade();
  
  const createMaterial = useCreateMaterial();
  const createAssignment = useCreateAssignment();
  const createAnnouncement = useCreateAnnouncement();
  const deleteMaterial = useDeleteMaterial();
  const deleteAssignment = useDeleteAssignment();
  const deleteAnnouncement = useDeleteAnnouncement();
  const gradeSubmission = useGradeSubmission();
  const { toast } = useToast();
  
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', file: null as File | null, external_link: '' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', instructions: '', deadline: '', max_points: 100 });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'medium' });
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });

  const handleCreateMaterial = async () => {
    if (!materialForm.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    
    const formData = new FormData();
    formData.append('title', materialForm.title);
    formData.append('description', materialForm.description);
    formData.append('subject_id', subjectId || '');
    if (materialForm.file) {
      formData.append('file', materialForm.file);
    }
    if (materialForm.external_link) {
      formData.append('external_link', materialForm.external_link);
    }
    
    try {
      await createMaterial.mutateAsync(formData);
      toast({ title: "Material uploaded successfully" });
      setIsMaterialOpen(false);
      setMaterialForm({ title: '', description: '', file: null, external_link: '' });
    } catch (error) {
      toast({ title: "Failed to upload material", variant: "destructive" });
    }
  };

  const handleCreateAssignment = async () => {
    if (!assignmentForm.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    
    try {
      await createAssignment.mutateAsync({
        ...assignmentForm,
        subject_id: subjectId,
        deadline: assignmentForm.deadline || null,
      });
      toast({ title: "Assignment created successfully" });
      setIsAssignmentOpen(false);
      setAssignmentForm({ title: '', description: '', instructions: '', deadline: '', max_points: 100 });
    } catch (error) {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }
    
    try {
      await createAnnouncement.mutateAsync({
        ...announcementForm,
        subject_id: subjectId,
        target_audience: 'students',
      });
      toast({ title: "Announcement posted successfully" });
      setIsAnnouncementOpen(false);
      setAnnouncementForm({ title: '', content: '', priority: 'medium' });
    } catch (error) {
      toast({ title: "Failed to post announcement", variant: "destructive" });
    }
  };

  const handleGrade = async () => {
    if (!gradeForm.grade) {
      toast({ title: "Grade is required", variant: "destructive" });
      return;
    }
    
    try {
      await gradeSubmission.mutateAsync({
        id: selectedSubmission.id,
        grade: parseFloat(gradeForm.grade),
        feedback: gradeForm.feedback,
      });
      toast({ title: "Grade submitted successfully" });
      setIsGradingOpen(false);
      setSelectedSubmission(null);
      setGradeForm({ grade: '', feedback: '' });
    } catch (error) {
      toast({ title: "Failed to submit grade", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const subjectData = Array.isArray(subject) ? subject[0] : subject;

  if (!subjectData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Subject not found</h3>
            <p className="text-muted-foreground">
              The subject you're looking for doesn't exist or you're not assigned to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl">{subjectData.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{subjectData.code}</p>
            </div>
            <Badge variant="secondary">{subjectData.units} unit{subjectData.units > 1 ? 's' : ''}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Section {subjectData.section?.name || 'TBA'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Schedule available</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Room assigned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Announcements</CardTitle>
                <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                      <DialogDescription>Post an announcement for this subject</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={announcementForm.title}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                          placeholder="Announcement title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                          placeholder="Announcement content"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <select
                          value={announcementForm.priority}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAnnouncement} disabled={createAnnouncement.isPending}>
                        {createAnnouncement.isPending ? 'Posting...' : 'Post'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <Badge variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted on {new Date(announcement.published_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAnnouncement.mutate(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No announcements yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Course Materials</CardTitle>
                <Dialog open={isMaterialOpen} onOpenChange={setIsMaterialOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Material</DialogTitle>
                      <DialogDescription>Upload a file or add a link for this subject</DialogDescription>
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
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>File</Label>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files?.[0] || null })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Or External Link</Label>
                        <Input
                          value={materialForm.external_link}
                          onChange={(e) => setMaterialForm({ ...materialForm, external_link: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMaterialOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateMaterial} disabled={createMaterial.isPending}>
                        {createMaterial.isPending ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {materials && materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((material: any) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{material.title}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMaterial.mutate(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No materials uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Assignments</CardTitle>
                <Dialog open={isAssignmentOpen} onOpenChange={setIsAssignmentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Assignment</DialogTitle>
                      <DialogDescription>Create a new assignment for this subject</DialogDescription>
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
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          value={assignmentForm.instructions}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                          placeholder="Detailed instructions"
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
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, max_points: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAssignmentOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAssignment} disabled={createAssignment.isPending}>
                        {createAssignment.isPending ? 'Creating...' : 'Create'}
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                          {assignment.deadline && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Deadline: {new Date(assignment.deadline).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAssignment.mutate(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No assignments created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission: any) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {submission.student?.user?.name} - {submission.assignment?.title || submission.material?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{submission.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'}>
                          {submission.status}
                        </Badge>
                      </div>
                      {submission.status !== 'graded' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsGradingOpen(true);
                          }}
                        >
                          Grade
                        </Button>
                      )}
                      {submission.status === 'graded' && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Grade: </span>
                          {submission.grade}%
                          {submission.feedback && <span className="text-muted-foreground ml-2">- {submission.feedback}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No submissions to grade</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Grading Dialog */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.student?.user?.name} - {selectedSubmission?.assignment?.title || selectedSubmission?.material?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Grade (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={gradeForm.grade}
                onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                placeholder="Enter grade"
              />
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                placeholder="Provide feedback"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradingOpen(false)}>Cancel</Button>
            <Button onClick={handleGrade} disabled={gradeSubmission.isPending}>
              {gradeSubmission.isPending ? 'Submitting...' : 'Submit Grade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultySubjectDetail;
