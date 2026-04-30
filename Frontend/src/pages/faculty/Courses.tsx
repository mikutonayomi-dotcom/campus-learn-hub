import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Search, Users, Clock, MapPin, Loader2, 
  ChevronRight
} from "lucide-react";
import { useMyClasses } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

const FacultyCourses = () => {
  const navigate = useNavigate();
  const { data: classes, isLoading } = useMyClasses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes?.filter((classItem: any) =>
    classItem.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.subject?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.section?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-display font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground text-sm">
            View and manage your assigned classes
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((classItem: any) => (
            <Card 
              key={`${classItem.subject_id}-${classItem.section_id}`} 
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/faculty/courses/${classItem.subject_id}/${classItem.section_id}`)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {classItem.subject?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{classItem.subject?.code}</p>
                    </div>
                    <Badge variant="secondary">{classItem.subject?.units} unit{classItem.subject?.units > 1 ? 's' : ''}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Section: {classItem.section?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{classItem.students_count} students</span>
                    </div>
                    {classItem.room && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{classItem.room?.name || classItem.room?.code}</span>
                      </div>
                    )}
                    {classItem.schedules && classItem.schedules.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{classItem.schedules.length} schedule{classItem.schedules.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Manage Class
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No classes found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'You have not been assigned to any classes yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultyCourses;
