import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  ClipboardList, 
  Award, 
  Calendar, 
  Bell, 
  Loader2,
  GraduationCap,
  MapPin,
  Code,
  CheckCircle,
  Clock,
  Cpu,
  Monitor,
  Lightbulb,
  Target,
  Zap,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Building2,
  Library,
  FolderOpen,
  ScrollText
} from "lucide-react";
import { useMySubjects, useMySubmissions, useMyProfile, useMySchedule, useNotifications, useUnreadCount } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: subjects, isLoading: subjectsLoading } = useMySubjects();
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions();
  const { data: schedule, isLoading: scheduleLoading } = useMySchedule();
  const { data: notifications, isLoading: notifLoading } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const [animatedStats, setAnimatedStats] = useState({ subjects: 0, tasks: 0, achievements: 0, gpa: 0 });

  const isLoading = profileLoading || subjectsLoading || submissionsLoading || scheduleLoading || notifLoading;

  // Calculate stats
  const enrolledSubjects = subjects?.length || 0;
  const pendingTasks = submissions?.filter((s: any) => s.status === 'submitted')?.length || 0;
  const approvedAchievements = profile?.achievements?.filter((a: any) => a.status === 'approved')?.length || 0;
  const gpa = profile?.gpa || 3.5;
  const completedUnits = profile?.completed_units || 45;
  const totalUnits = 150;
  const progressPercentage = (completedUnits / totalUnits) * 100;

  // Animate stats on mount
  useEffect(() => {
    if (!isLoading) {
      const duration = 1000;
      const steps = 30;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setAnimatedStats({
          subjects: Math.round(enrolledSubjects * progress),
          tasks: Math.round(pendingTasks * progress),
          achievements: Math.round(approvedAchievements * progress),
          gpa: Math.round(gpa * 10 * progress) / 10,
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isLoading, enrolledSubjects, pendingTasks, approvedAchievements, gpa]);

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todaysClasses = schedule?.filter((s: any) => s.day === today) || [];

  // Quick access features
  const quickAccess = [
    {
      title: "Curriculum Tracker",
      description: "Monitor your grades and completed units for all CC and IT core subjects.",
      icon: ScrollText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      link: "/student/curriculum"
    },
    {
      title: "Prerequisite Checker",
      description: "Ensure you are eligible for advanced courses like Software Engineering and System Integration.",
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      link: "/student/prerequisites"
    },
    {
      title: "Laboratory Schedules",
      description: "Check the availability of CCS computer labs for your hands-on coding and networking sessions.",
      icon: Monitor,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      link: "/student/labs"
    },
    {
      title: "Capstone Hub",
      description: "Access resources and guidelines for your Junior and Senior project requirements.",
      icon: Lightbulb,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      link: "/student/capstone"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 sm:p-8 lg:p-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-20">
          <Cpu className="h-16 w-16 sm:h-24 sm:w-24" />
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 opacity-20">
          <Code className="h-12 w-12 sm:h-16 sm:w-16" />
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Welcome to the CCS Student Portal!</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Pamantasan ng Cabuyao
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-4">
            College of Computing and Engineering
          </p>

          {/* Welcome Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6">
            <p className="text-base sm:text-lg leading-relaxed">
              Welcome, <span className="font-semibold">{user?.name || "Future IT Professional"}</span>! 
              This dashboard is specifically designed for the <span className="font-semibold">Bachelor of Science in Information Technology (BSIT)</span> program. 
              Here, you can manage your academic journey, track your technical competencies, and stay connected with the CCS Department.
            </p>
          </div>

          {/* Additional Info */}
          <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed mb-6">
            As a student of the College of Computing Studies, you are at the forefront of innovation. 
            Use this portal to monitor your progress through the BSIT curriculum—from mastering your first lines of code to deploying your final Capstone Project.
          </p>

          {/* Quote */}
          <div className="border-l-4 border-white/30 pl-4">
            <p className="text-sm sm:text-base italic text-primary-foreground/90">
              "Innovation through Information, Excellence through Technology."
            </p>
            <p className="text-xs sm:text-sm text-primary-foreground/70 mt-1">
              Stay hungry for knowledge, and let's build the future of Cabuyao together!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">CCS Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((item, index) => (
            <Card 
              key={item.title}
              className={cn(
                "group cursor-pointer overflow-hidden transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Gradient Header */}
                <div className={cn("h-2 bg-gradient-to-r", item.color)} />
                <div className="p-5">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    "transition-transform duration-300 group-hover:scale-110",
                    item.bgColor
                  )}>
                    <item.icon className={cn("h-6 w-6", item.color.replace("from-", "text-").split(" ")[0])} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  {/* Action */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "p-0 h-auto font-medium hover:bg-transparent",
                      "group/btn"
                    )}
                  >
                    <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", item.color)}>
                      Access Now
                    </span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stats Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Academic Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Enrolled", value: animatedStats.subjects, total: enrolledSubjects, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
              { label: "Pending Tasks", value: animatedStats.tasks, total: pendingTasks, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-100" },
              { label: "Achievements", value: animatedStats.achievements, total: approvedAchievements, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
              { label: "Current GPA", value: animatedStats.gpa.toFixed(1), total: gpa.toFixed(1), icon: Target, color: "text-purple-600", bg: "bg-purple-100", isGpa: true },
            ].map((stat) => (
              <Card key={stat.label} className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    {stat.label === "Pending Tasks" && pendingTasks > 0 && (
                      <Badge variant="destructive" className="text-xs">{pendingTasks}</Badge>
                    )}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.isGpa ? stat.value : animatedStats.subjects === enrolledSubjects ? stat.total : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Progress Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              BSIT Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completed Units</span>
                  <span className="font-semibold">{completedUnits} / {totalUnits}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{progressPercentage.toFixed(1)}% completed</p>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Year</span>
                  <span className="font-semibold">{profile?.year_level || "2nd Year"}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Program</span>
                <span className="font-semibold">BSIT</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-semibold">CCS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todaysClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                <p className="text-xs text-muted-foreground mt-1">Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((item: any, i: number) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-4 p-3 rounded-lg transition-all duration-200",
                      "hover:bg-muted/50 border border-transparent hover:border-border"
                    )}
                  >
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-sm font-semibold text-primary">
                        {item.start_time?.substring(0, 5)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.end_time?.substring(0, 5)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.subject?.code} - {item.subject?.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3" />
                        <span className="truncate">{item.faculty?.user?.name}</span>
                        <span className="text-border">|</span>
                        <MapPin className="h-3 w-3" />
                        <span>{item.room?.name || "TBA"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications?.slice(0, 5).map((item: any) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                      !item.is_read 
                        ? 'bg-primary/5 border border-primary/20' 
                        : 'hover:bg-muted/50 border border-transparent'
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      !item.is_read ? "bg-primary animate-pulse" : "bg-transparent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm truncate",
                        !item.is_read ? "font-medium text-foreground" : "text-muted-foreground"
                      )}>
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: "Main Building", value: "Building 1" },
          { icon: Library, label: "Library", value: "2nd Floor" },
          { icon: Monitor, label: "Computer Labs", value: "3 Labs" },
          { icon: FolderOpen, label: "Resources", value: "CCS Portal" },
        ].map((info) => (
          <Card key={info.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <info.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{info.label}</p>
                <p className="text-sm font-semibold truncate">{info.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
