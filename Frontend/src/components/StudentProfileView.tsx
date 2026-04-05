import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, Mail, Phone, MapPin, User, 
  Award, AlertTriangle, Users, BookOpen, X, Loader2,
  CheckCircle2, Shield
} from "lucide-react";
import { useStudent } from "@/hooks/useApi";

interface StudentProfileViewProps {
  studentId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentProfileView = ({ studentId, isOpen, onClose }: StudentProfileViewProps) => {
  const { data: student, isLoading } = useStudent(studentId);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "regular": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "irregular": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "probation": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "suspended": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getViolationSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor": return "bg-yellow-100 text-yellow-800";
      case "major": return "bg-orange-100 text-orange-800";
      case "grave": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Student Profile
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !student ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            Student not found
          </div>
        ) : (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Personal Information Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center md:items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {student.user?.name?.[0]?.toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-4 text-center md:text-left">
                        <h3 className="text-xl font-semibold">{student.user?.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.student_id}</p>
                        <Badge className={`mt-2 ${getStatusColor(student.status)}`}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>

                    <Separator orientation="vertical" className="hidden md:block h-32" />

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Email
                        </p>
                        <p className="text-sm font-medium">{student.user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Contact
                        </p>
                        <p className="text-sm font-medium">{student.contact_number || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> Course
                        </p>
                        <p className="text-sm font-medium">{student.course?.name || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Section & Year
                        </p>
                        <p className="text-sm font-medium">{student.year_level}{student.year_level === 1 ? 'st' : student.year_level === 2 ? 'nd' : student.year_level === 3 ? 'rd' : 'th'} Year - {student.section?.name || student.section || "N/A"}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Address
                        </p>
                        <p className="text-sm font-medium">{student.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {(student.emergency_contact_name || student.emergency_contact_number) && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Emergency Contact
                      </p>
                      <p className="text-sm font-medium">
                        {student.emergency_contact_name} {student.emergency_contact_number && `- ${student.emergency_contact_number}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs for Additional Information */}
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="skills" className="gap-1">
                    <Award className="h-4 w-4" /> Skills
                  </TabsTrigger>
                  <TabsTrigger value="organizations" className="gap-1">
                    <Users className="h-4 w-4" /> Organizations
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Achievements
                  </TabsTrigger>
                  <TabsTrigger value="violations" className="gap-1">
                    <AlertTriangle className="h-4 w-4" /> Violations
                  </TabsTrigger>
                </TabsList>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Skills ({student.skills?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {student.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill: any) => (
                            <Badge key={skill.id} variant="secondary" className="text-sm py-1 px-3">
                              {skill.name}
                              {skill.pivot?.level && (
                                <span className="ml-1 text-xs opacity-70">({skill.pivot.level})</span>
                              )}
                              {skill.pivot?.is_verified && (
                                <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No skills recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Organizations Tab */}
                <TabsContent value="organizations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Organization Affiliations ({student.organizations?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {student.organizations?.length > 0 ? (
                        <div className="space-y-3">
                          {student.organizations.map((org: any) => (
                            <div key={org.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{org.name}</p>
                                <p className="text-sm text-muted-foreground">{org.category}</p>
                              </div>
                              <div className="text-right">
                                {org.pivot?.role && (
                                  <Badge variant="outline">{org.pivot.role}</Badge>
                                )}
                                {org.pivot?.joined_at && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Joined: {new Date(org.pivot.joined_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No organization affiliations</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Achievements ({student.achievements?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {student.achievements?.length > 0 ? (
                        <div className="space-y-3">
                          {student.achievements.map((achievement: any) => (
                            <div key={achievement.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{achievement.title}</p>
                                  <p className="text-sm text-muted-foreground">{achievement.type}</p>
                                  {achievement.organization && (
                                    <p className="text-xs text-muted-foreground">Org: {achievement.organization}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <Badge variant={achievement.status === "approved" ? "default" : "secondary"}>
                                    {achievement.status}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.achievement_date && new Date(achievement.achievement_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {achievement.description && (
                                <p className="text-sm text-muted-foreground mt-2">{achievement.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No achievements recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Violations Tab */}
                <TabsContent value="violations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        Violations ({student.violations?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {student.violations?.length > 0 ? (
                        <div className="space-y-3">
                          {student.violations.map((violation: any) => (
                            <div key={violation.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{violation.type}</p>
                                  <Badge className={`mt-1 ${getViolationSeverityColor(violation.severity)}`}>
                                    {violation.severity}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <Badge variant={violation.status === "approved" ? "destructive" : "secondary"}>
                                    {violation.status}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {violation.violation_date && new Date(violation.violation_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {violation.description && (
                                <p className="text-sm text-muted-foreground mt-2">{violation.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                          <p className="text-muted-foreground">No violations recorded</p>
                          <p className="text-sm text-green-600">Great job keeping a clean record!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Academic Summary */}
              {student.grades && student.grades.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Academic Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {(student.grades.reduce((acc: number, g: any) => acc + (g.total_grade || 0), 0) / student.grades.filter((g: any) => g.total_grade).length || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">Average Grade</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{student.grades.length}</p>
                        <p className="text-xs text-muted-foreground">Subjects Taken</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {student.grades.filter((g: any) => g.total_grade && g.total_grade <= 3.0).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Passed</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {student.grades.filter((g: any) => g.total_grade && g.total_grade > 3.0).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Failed/Incomplete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default StudentProfileView;
