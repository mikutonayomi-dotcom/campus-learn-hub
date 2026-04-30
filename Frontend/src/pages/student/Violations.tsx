import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, Calendar, FileText, Loader2, Search, Plus
} from "lucide-react";
import { useViolations, useCreateViolation, useStudents, useViolationTypes } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const StudentViolations = () => {
  const { data: violations, isLoading } = useViolations();
  const createViolation = useCreateViolation();
  const { data: students } = useStudents();
  const { data: violationTypes } = useViolationTypes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [violationForm, setViolationForm] = useState({
    student_id: '',
    violation_type_id: '',
    description: '',
    violation_date: new Date().toISOString().split('T')[0]
  });

  const filteredViolations = violations?.filter((violation: any) =>
    violation.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    violation.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-red-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status || 'Pending'}</Badge>;
    }
  };

  const handleCreateViolation = async () => {
    if (!violationForm.student_id || !violationForm.violation_type_id || !violationForm.description) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await createViolation.mutateAsync({
        student_id: parseInt(violationForm.student_id),
        violation_type_id: parseInt(violationForm.violation_type_id),
        description: violationForm.description,
        violation_date: violationForm.violation_date,
      });
      toast({ title: "Violation report submitted successfully" });
      setIsCreateModalOpen(false);
      setViolationForm({
        student_id: '',
        violation_type_id: '',
        description: '',
        violation_date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      toast({
        title: "Error submitting violation",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Violations</h1>
          <p className="text-muted-foreground text-sm">
            View your disciplinary records
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Violation
          </Button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search violations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {filteredViolations.length > 0 ? (
        <div className="space-y-4">
          {filteredViolations.map((violation: any) => (
            <Card key={violation.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{violation.type || 'Violation'}</h3>
                            {violation.violation_type?.severity && (
                              <Badge variant={
                                violation.violation_type.severity === 'low' ? 'default' :
                                violation.violation_type.severity === 'medium' ? 'secondary' :
                                'destructive'
                              } className={
                                violation.violation_type.severity === 'low' ? 'bg-green-500' :
                                violation.violation_type.severity === 'medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }>
                                {violation.violation_type.severity}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {violation.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(violation.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date: {new Date(violation.date).toLocaleDateString()}</span>
                      </div>
                      {violation.admin_remarks && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Remarks: {violation.admin_remarks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No violations found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'Good job! You have no disciplinary records.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Violation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Violation</DialogTitle>
            <DialogDescription>Report a student violation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student *</Label>
              <Select value={violationForm.student_id} onValueChange={(value) => setViolationForm({ ...violationForm, student_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.user?.name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="violation_type_id">Violation Type *</Label>
              <Select value={violationForm.violation_type_id} onValueChange={(value) => setViolationForm({ ...violationForm, violation_type_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  {violationTypes?.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{type.name}</span>
                        <Badge variant={
                          type.severity === 'low' ? 'default' :
                          type.severity === 'medium' ? 'secondary' :
                          'destructive'
                        } className={
                          type.severity === 'low' ? 'bg-green-500' :
                          type.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }>
                          {type.severity}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={violationForm.description}
                onChange={(e) => setViolationForm({ ...violationForm, description: e.target.value })}
                placeholder="Describe the incident..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="violation_date">Date</Label>
              <Input
                id="violation_date"
                type="date"
                value={violationForm.violation_date}
                onChange={(e) => setViolationForm({ ...violationForm, violation_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateViolation} disabled={createViolation.isPending}>
              {createViolation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViolations;
