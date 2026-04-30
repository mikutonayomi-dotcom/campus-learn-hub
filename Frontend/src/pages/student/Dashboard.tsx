import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, CheckCircle, AlertCircle, Loader2, Clock, TrendingUp, Bell, GraduationCap, Target, Heart
} from "lucide-react";
import { useMyProfile, useMySubjects, useMySubmissions, useMyGrades, useAnnouncements } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import pncBackground from "@/assets/PNC-background.jpg";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: subjects, isLoading: subjectsLoading } = useMySubjects();
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions();
  const { data: grades, isLoading: gradesLoading } = useMyGrades();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  const isLoading = profileLoading || subjectsLoading || submissionsLoading || gradesLoading || announcementsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingSubmissions = submissions?.filter((s: any) => s.status === 'pending').length || 0;
  const totalSubjects = subjects?.length || 0;
  const averageGrade = grades?.length > 0 
    ? (grades.reduce((sum: number, g: any) => sum + g.grade, 0) / grades.length).toFixed(2)
    : 'N/A';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section with PNC Background */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 sm:p-12"
        style={{
          backgroundImage: `url(${pncBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold">
                Welcome back, {profile?.user?.name?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-1">
                {profile?.course?.name} - Year {profile?.year_level} - {profile?.section?.name}
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-sm">
            {profile?.semester} Semester
          </Badge>
        </div>
      </div>

      {/* Mission and Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To provide quality education that develops competent, ethical, and socially responsible professionals 
              equipped with the knowledge and skills to excel in the field of Information Technology and contribute 
              to nation-building.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-lg">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To be a leading institution in technological education, recognized for excellence in teaching, 
              research, and community service, producing graduates who are innovative, globally competitive, 
              and committed to ethical values.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}</div>
            <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">New updates</p>
          </CardContent>
        </Card>
      </div>

      {/* My Subjects */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Subjects</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/academics')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subjects && subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.slice(0, 6).map((subject: any) => (
                <Card key={subject.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm">{subject.name}</h3>
                        <Badge variant="secondary" className="text-xs">{subject.code}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {subject.units} unit{subject.units > 1 ? 's' : ''}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => navigate(`/student/academics/${subject.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No subjects enrolled yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New material uploaded</p>
                <p className="text-xs text-muted-foreground">Programming 101 - Lecture Notes</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment deadline approaching</p>
                <p className="text-xs text-muted-foreground">Database Systems - Project Phase 1</p>
                <p className="text-xs text-muted-foreground mt-1">Due in 2 days</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Grade posted</p>
                <p className="text-xs text-muted-foreground">Web Development - Quiz 1</p>
                <p className="text-xs text-muted-foreground mt-1">Score: 95/100</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
