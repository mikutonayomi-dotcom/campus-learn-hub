import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, Calendar, FileText, Loader2, Search, 
  CheckCircle, XCircle
} from "lucide-react";
import { useAchievements, useApproveAchievement, useRejectAchievement } from "@/hooks/useApi";

const FacultyAchievements = () => {
  const { data: achievements, isLoading } = useAchievements();
  const approveAchievement = useApproveAchievement();
  const rejectAchievement = useRejectAchievement();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAchievements = achievements?.filter((achievement: any) =>
    achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status || 'Pending'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground text-sm">
            Manage student awards and accomplishments
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredAchievements.length > 0 ? (
        <div className="space-y-4">
          {filteredAchievements.map((achievement: any) => (
            <Card key={achievement.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center shrink-0">
                          <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{achievement.title || 'Achievement'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.student?.user?.name || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(achievement.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date: {new Date(achievement.date).toLocaleDateString()}</span>
                      </div>
                      {achievement.admin_remarks && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Remarks: {achievement.admin_remarks}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {achievement.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => approveAchievement.mutate(achievement.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => rejectAchievement.mutate(achievement.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No achievements recorded yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultyAchievements;
