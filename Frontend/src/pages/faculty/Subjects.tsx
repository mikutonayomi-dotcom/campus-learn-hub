import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Search, Clock, MapPin, Loader2, ChevronRight, Users
} from "lucide-react";
import { useMyClasses } from "@/hooks/useApi";

const FacultySubjects = () => {
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
          <h1 className="text-2xl font-display font-bold text-foreground">My Subjects</h1>
          <p className="text-muted-foreground text-sm">
            View and manage your assigned subjects
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

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((classItem: any) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{classItem.subject?.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{classItem.subject?.code}</p>
                  </div>
                  <Badge variant="secondary">{classItem.subject?.units} unit{classItem.subject?.units > 1 ? 's' : ''}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Section {classItem.section?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {classItem.day} {classItem.start_time?.substring(0, 5)} - {classItem.end_time?.substring(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{classItem.room?.name || classItem.room?.code || 'TBA'}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/faculty/subjects/${classItem.subject?.id}`)}
                >
                  Manage Subject
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'You are not assigned to any subjects yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacultySubjects;
