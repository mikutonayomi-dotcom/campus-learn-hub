import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useViolations, useApproveViolation, useRejectViolation } from "@/hooks/useApi";
import { useAchievements, useApproveAchievement, useRejectAchievement } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const AdminApprovals = () => {
  const { toast } = useToast();
  const { data: violations, isLoading: vLoading } = useViolations({ status: "pending" });
  const { data: achievements, isLoading: aLoading } = useAchievements({ status: "pending" });
  
  const approveViolation = useApproveViolation();
  const rejectViolation = useRejectViolation();
  const approveAchievement = useApproveAchievement();
  const rejectAchievement = useRejectAchievement();

  const isLoading = vLoading || aLoading;

  const pendingItems = [
    ...(violations?.map((v: any) => ({
      id: `v-${v.id}`,
      type: "Violation",
      title: v.type,
      description: v.description,
      submittedBy: v.reporter?.user?.name || "Unknown",
      student: v.student?.user?.name || "Unknown",
      date: new Date(v.created_at).toLocaleDateString(),
      severity: v.severity,
      entity: v,
      onApprove: () => handleApproveViolation(v.id),
      onReject: () => handleRejectViolation(v.id),
    })) || []),
    ...(achievements?.map((a: any) => ({
      id: `a-${a.id}`,
      type: "Achievement",
      title: a.title,
      description: a.description,
      submittedBy: a.recorder?.user?.name || "Unknown",
      student: a.student?.user?.name || "Unknown",
      date: new Date(a.created_at).toLocaleDateString(),
      severity: a.type,
      entity: a,
      onApprove: () => handleApproveAchievement(a.id),
      onReject: () => handleRejectAchievement(a.id),
    })) || []),
  ];

  const handleApproveViolation = async (id: number) => {
    try {
      await approveViolation.mutateAsync({ id });
      toast({ title: "Success", description: "Violation approved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to approve", variant: "destructive" });
    }
  };

  const handleRejectViolation = async (id: number) => {
    const remarks = prompt("Enter rejection remarks:");
    if (!remarks) return;
    try {
      await rejectViolation.mutateAsync({ id, remarks });
      toast({ title: "Success", description: "Violation rejected" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to reject", variant: "destructive" });
    }
  };

  const handleApproveAchievement = async (id: number) => {
    try {
      await approveAchievement.mutateAsync({ id });
      toast({ title: "Success", description: "Achievement approved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to approve", variant: "destructive" });
    }
  };

  const handleRejectAchievement = async (id: number) => {
    const remarks = prompt("Enter rejection remarks:");
    if (!remarks) return;
    try {
      await rejectAchievement.mutateAsync({ id, remarks });
      toast({ title: "Success", description: "Achievement rejected" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to reject", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /> Approvals</h1>
          <p className="text-muted-foreground text-sm">Review and approve pending submissions</p>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /> Approvals</h1>
        <p className="text-muted-foreground text-sm">Review and approve pending submissions</p>
      </div>

      {pendingItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No pending approvals</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingItems.map((item) => (
            <Card key={item.id} className="transition-all duration-200 hover:shadow-lg group">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{item.type}</Badge>
                      <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">Submitted by {item.submittedBy} • Student: {item.student}</p>
                    <p className="text-xs text-muted-foreground">{item.date} • {item.severity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="gap-1 transition-all duration-200 hover:scale-105"
                      onClick={item.onApprove}
                      disabled={approveViolation.isPending || approveAchievement.isPending}
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-1 transition-all duration-200 hover:scale-105"
                      onClick={item.onReject}
                      disabled={rejectViolation.isPending || rejectAchievement.isPending}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
