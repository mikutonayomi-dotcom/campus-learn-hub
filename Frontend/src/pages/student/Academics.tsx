import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Search, Clock, User, MapPin, Loader2, 
  ChevronRight
} from "lucide-react";
import { useMySubjects, useMySchedule } from "@/hooks/useApi";

const StudentAcademics = () => {
  const navigate = useNavigate();
  const { data: subjects, isLoading } = useMySubjects();
  const { data: schedules } = useMySchedule();
  const [searchTerm, setSearchTerm] = useState("");

  // Create a map of subject_id to schedule for quick lookup
  const scheduleMap = schedules?.reduce((acc: any, item: any) => {
    if (item.has_schedule && item.schedule) {
      acc[item.subject.id] = item.schedule;
    }
    return acc;
  }, {}) || {};

  const filteredSubjects = subjects?.filter((subject: any) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Subjects</h1>
          <p className="text-muted-foreground text-sm">
            View and manage your enrolled subjects
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredSubjects.length > 0 ? (
        <div className="space-y-4">
          {filteredSubjects.map((subject: any) => {
            const schedule = scheduleMap[subject.id];
            return (
              <Card key={subject.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{subject.code}</p>
                    </div>
                    <Badge variant="secondary">{subject.units} unit{subject.units > 1 ? 's' : ''}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{schedule?.faculty?.user?.name || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {schedule 
                          ? `${schedule.day} ${schedule.start_time?.substring(0, 5)} - ${schedule.end_time?.substring(0, 5)}`
                          : 'TBA'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{schedule?.room?.name || schedule?.room?.code || 'TBA'}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => navigate(`/student/academics/${subject.id}`)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'You are not enrolled in any subjects yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentAcademics;
