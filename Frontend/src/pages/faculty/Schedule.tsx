import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, MapPin, User, Loader2
} from "lucide-react";
import { useMySchedule } from "@/hooks/useApi";

const FacultySchedule = () => {
  const { data: schedules, isLoading } = useMySchedule();
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSchedules = selectedDay === 'all' 
    ? schedules 
    : schedules?.filter((s: any) => s.day.toLowerCase() === selectedDay.toLowerCase()) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatTime = (time: string | null | undefined) => {
    if (!time) return 'TBA';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground text-sm">
            View your teaching schedule
          </p>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDay === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDay('all')}
        >
          All Days
        </Button>
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day.toLowerCase() ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day.toLowerCase())}
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>

      {filteredSchedules && filteredSchedules.length > 0 ? (
        <div className="space-y-4">
          {filteredSchedules.map((schedule: any) => (
            <Card key={schedule.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {schedule.subject?.name || 'Subject'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {schedule.subject?.code || 'N/A'} • {schedule.section?.name || 'N/A'}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {schedule.day}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{schedule.room?.name || schedule.room?.code || 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{schedule.section?.students_count || 0} students</span>
                      </div>
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
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No schedule found</h3>
            <p className="text-muted-foreground">
              {selectedDay === 'all' 
                ? 'You have no scheduled classes yet' 
                : `No classes scheduled for ${selectedDay}`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultySchedule;
