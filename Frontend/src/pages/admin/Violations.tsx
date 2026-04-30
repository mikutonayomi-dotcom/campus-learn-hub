import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Check, X, Loader2 } from "lucide-react";
import { useViolations, useApproveViolation, useRejectViolation } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface ViolationData {
  id: number;
  student_id: number;
  type: string;
  severity: string;
  description: string;
  violation_date: string;
  status: string;
  evidence_path: string | null;
  admin_remarks: string | null;
  student: { user: { name: string } };
  reporter: { user: { name: string } };
}

const Violations = () => {
  const { data: violations, isLoading } = useViolations({ status: 'pending' });
  const approveViolation = useApproveViolation();
  const rejectViolation = useRejectViolation();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<ViolationData | null>(null);
  const [adminRemarks, setAdminRemarks] = useState("");

  const handleApprove = async () => {
    if (!selectedViolation) return;
    try {
      await approveViolation.mutateAsync({
        id: selectedViolation.id,
        admin_remarks: adminRemarks || undefined,
      });
      toast({ title: "Violation approved successfully" });
      setIsApproveModalOpen(false);
      setSelectedViolation(null);
      setAdminRemarks("");
    } catch (error: any) {
      toast({
        title: "Error approving violation",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedViolation) return;
    if (!adminRemarks.trim()) {
      toast({ title: "Remarks required for rejection", variant: "destructive" });
      return;
    }
    try {
      await rejectViolation.mutateAsync({
        id: selectedViolation.id,
        admin_remarks: adminRemarks,
      });
      toast({ title: "Violation rejected successfully" });
      setIsRejectModalOpen(false);
      setSelectedViolation(null);
      setAdminRemarks("");
    } catch (error: any) {
      toast({
        title: "Error rejecting violation",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const filteredViolations = violations?.filter(
    (v: ViolationData) =>
      v.student?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Pending Violations</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and approve/reject reported violations</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search violations..."
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
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No pending violations</TableCell>
                </TableRow>
              ) : (
                filteredViolations.map((violation: ViolationData) => (
                  <TableRow key={violation.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-medium">{violation.student?.user?.name || "Unknown"}</TableCell>
                    <TableCell>{violation.type}</TableCell>
                    <TableCell>
                      <Badge variant={violation.severity === 'grave' ? 'destructive' : violation.severity === 'major' ? 'default' : 'secondary'}>
                        {violation.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{violation.description}</TableCell>
                    <TableCell>{new Date(violation.violation_date).toLocaleDateString()}</TableCell>
                    <TableCell>{violation.reporter?.user?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            setSelectedViolation(violation);
                            setAdminRemarks("");
                            setIsApproveModalOpen(true);
                          }}
                          disabled={approveViolation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedViolation(violation);
                            setAdminRemarks("");
                            setIsRejectModalOpen(true);
                          }}
                          disabled={rejectViolation.isPending}
                        >
                          <X className="h-4 w-4" />
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

      {/* Approve Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Violation</DialogTitle>
            <DialogDescription>Confirm approval of this violation report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedViolation?.type}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedViolation?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Student: {selectedViolation?.student?.user?.name}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_remarks">Admin Remarks (Optional)</Label>
              <Textarea
                id="admin_remarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsApproveModalOpen(false); setSelectedViolation(null); }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveViolation.isPending}>
              {approveViolation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Approving...</> : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Violation</DialogTitle>
            <DialogDescription>Provide reason for rejecting this violation report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedViolation?.type}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedViolation?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Student: {selectedViolation?.student?.user?.name}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject_remarks">Rejection Reason *</Label>
              <Textarea
                id="reject_remarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Explain why this violation is being rejected..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRejectModalOpen(false); setSelectedViolation(null); }}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={rejectViolation.isPending} variant="destructive">
              {rejectViolation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Rejecting...</> : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Violations;
