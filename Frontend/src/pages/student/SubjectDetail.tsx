import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, FileText, GraduationCap, ArrowLeft, 
  Loader2, Clock, MapPin, User, Upload, Download,
  Megaphone
} from "lucide-react";
import { useMySubjects, useMaterials, useSubmissions, useMyGrades, useQuizzes, useAssignments, useCreateSubmission, useStartQuiz, useSubmitQuiz, useDownloadMaterial, useAnnouncements } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const StudentSubjectDetail = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { data: subjects, isLoading } = useMySubjects();
  const { data: materials } = useMaterials({ subject_id: subjectId });
  const { data: submissions } = useSubmissions({ subject_id: subjectId });
  const { data: grades } = useMyGrades();
  const { data: quizzes } = useQuizzes({ subject_id: subjectId });
  const { data: assignments } = useAssignments({ subject_id: subjectId });
  const { data: announcements } = useAnnouncements({ subject_id: subjectId });
  const createSubmission = useCreateSubmission();
  const startQuiz = useStartQuiz();
  const submitQuiz = useSubmitQuiz();
  const downloadMaterial = useDownloadMaterial();
  const { toast } = useToast();
  
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionForm, setSubmissionForm] = useState({ title: '', description: '', file: null as File | null });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  
  const subject = subjects?.find((s: any) => s.id === parseInt(subjectId || '0'));

  const handleSubmission = async () => {
    if (!submissionForm.file) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', submissionForm.file);
    formData.append('title', submissionForm.title);
    formData.append('description', submissionForm.description);
    formData.append('assignment_id', selectedAssignment?.id || '');
    
    try {
      await createSubmission.mutateAsync(formData);
      toast({ title: "Submission uploaded successfully" });
      setIsSubmitOpen(false);
      setSelectedAssignment(null);
      setSubmissionForm({ title: '', description: '', file: null });
    } catch (error) {
      toast({ title: "Failed to upload submission", variant: "destructive" });
    }
  };

  const getSubmissionStatus = (assignmentId: number) => {
    const submission = submissions?.find((s: any) => s.assignment_id === assignmentId);
    if (!submission) return { status: 'Not Submitted', color: 'secondary' };
    if (submission.status === 'graded') return { status: 'Graded', color: 'default' };
    if (submission.status === 'resubmitted') return { status: 'Resubmitted', color: 'outline' };
    return { status: 'Submitted', color: 'default' };
  };

  const isPastDeadline = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const handleStartQuiz = async (quizId: number) => {
    try {
      const result = await startQuiz.mutateAsync(quizId);
      setActiveQuiz(result);
      setQuizAnswers({});
    } catch (error) {
      toast({ title: "Failed to start quiz", variant: "destructive" });
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      await submitQuiz.mutateAsync({ quizId: activeQuiz.id, answers: quizAnswers });
      toast({ title: "Quiz submitted successfully" });
      setActiveQuiz(null);
    } catch (error) {
      toast({ title: "Failed to submit quiz", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subject) {
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
              The subject you're looking for doesn't exist or you're not enrolled in it.
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
              <CardTitle className="text-2xl">{subject.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{subject.code}</p>
            </div>
            <Badge variant="secondary">{subject.units} unit{subject.units > 1 ? 's' : ''}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Instructor assigned</span>
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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Megaphone className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <Badge variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted by {announcement.author?.name} on {new Date(announcement.published_at).toLocaleDateString()}
                          </p>
                        </div>
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
              <CardTitle className="text-lg">Course Materials</CardTitle>
            </CardHeader>
            <CardContent>
              {materials && materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((material: any) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{material.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => downloadMaterial.mutate(material.id)}
                            disabled={downloadMaterial.isPending}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {downloadMaterial.isPending ? 'Downloading...' : 'Download'}
                          </Button>
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
              <CardTitle className="text-lg">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments && assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment: any) => {
                    const { status, color } = getSubmissionStatus(assignment.id);
                    const pastDeadline = assignment.deadline && isPastDeadline(assignment.deadline);
                    return (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                          </div>
                          <Badge variant={color as any}>{status}</Badge>
                        </div>
                        {assignment.deadline && (
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <Clock className="h-4 w-4" />
                            <span className={pastDeadline ? "text-destructive" : "text-muted-foreground"}>
                              Deadline: {new Date(assignment.deadline).toLocaleString()}
                              {pastDeadline && " (Past Due)"}
                            </span>
                          </div>
                        )}
                        {assignment.instructions && (
                          <p className="text-sm text-muted-foreground mt-2">{assignment.instructions}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          {status === 'Not Submitted' && !pastDeadline && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setIsSubmitOpen(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Submit
                            </Button>
                          )}
                          {status === 'Graded' && (
                            <div className="text-sm">
                              <span className="font-medium">Grade: </span>
                              {submissions?.find((s: any) => s.assignment_id === assignment.id)?.grade}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No assignments available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission: any) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {submission.assignment?.title || submission.material?.title || submission.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">{submission.description}</p>
                        </div>
                        <Badge variant={submission.status === 'graded' ? 'default' : submission.status === 'resubmitted' ? 'outline' : 'secondary'}>
                          {submission.status === 'graded' ? `Graded: ${submission.grade}%` : submission.status}
                        </Badge>
                      </div>
                      {submission.feedback && (
                        <p className="text-sm text-primary mb-2">Feedback: {submission.feedback}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No submissions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              {activeQuiz ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{activeQuiz.title}</h3>
                    <p className="text-muted-foreground mb-6">{activeQuiz.description}</p>
                  </div>
                  {activeQuiz.questions?.map((question: any, index: number) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <p className="font-medium mb-3">{index + 1}. {question.question_text}</p>
                      <div className="space-y-2">
                        {question.options?.map((option: string, optIndex: number) => (
                          <label key={optIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              onChange={(e) => setQuizAnswers({ ...quizAnswers, [question.id]: e.target.value })}
                              className="w-4 h-4"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleSubmitQuiz} disabled={submitQuiz.isPending} className="w-full">
                    {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                </div>
              ) : quizzes && quizzes.length > 0 ? (
                <div className="space-y-4">
                  {quizzes.map((quiz: any) => (
                    <div key={quiz.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{quiz.title}</h4>
                        <Badge variant="outline">{quiz.duration_minutes} mins</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                      <Button size="sm" onClick={() => handleStartQuiz(quiz.id)}>
                        Start Quiz
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No quizzes available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {grades && grades.length > 0 ? (
                <div className="space-y-4">
                  {grades.filter((g: any) => g.subject_id === parseInt(subjectId || '0')).map((grade: any) => (
                    <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{grade.subject?.name || 'Subject'}</p>
                        <p className="text-sm text-muted-foreground">Midterm: {grade.midterm_grade}% | Final: {grade.final_grade}%</p>
                      </div>
                      <Badge variant={grade.total_grade >= 75 ? 'default' : 'destructive'}>
                        Total: {grade.total_grade}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No grades available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submission Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={submissionForm.title}
                onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                placeholder="Assignment title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={submissionForm.description}
                onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                placeholder="Brief description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files?.[0] || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmission} disabled={createSubmission.isPending}>
              {createSubmission.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSubjectDetail;
