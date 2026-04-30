import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Download, TrendingUp, Calendar, Award, AlertTriangle, Users } from "lucide-react";
import { 
  useStudentPerformanceReport, useAttendanceReport, useViolationSummary, useAchievementSummary, 
  useEventParticipationReport, useOrganizationReport, useCourses,
  useExportStudentPerformance, useExportAttendanceReport, useExportViolationSummary,
  useExportAchievementSummary, useExportEventParticipation, useExportOrganizationReport
} from "@/hooks/useApi";

const Reports = () => {
  const { data: courses } = useCourses();
  const { data: studentPerformance, isLoading: loadingPerformance } = useStudentPerformanceReport({});
  const { data: attendanceReport, isLoading: loadingAttendance } = useAttendanceReport({});
  const { data: violationSummary, isLoading: loadingViolations } = useViolationSummary({});
  const { data: achievementSummary, isLoading: loadingAchievements } = useAchievementSummary({});
  const { data: eventParticipation, isLoading: loadingEvents } = useEventParticipationReport({});
  const { data: organizationReport, isLoading: loadingOrgs } = useOrganizationReport({});

  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Export mutations
  const exportStudentPerformance = useExportStudentPerformance();
  const exportAttendanceReport = useExportAttendanceReport();
  const exportViolationSummary = useExportViolationSummary();
  const exportAchievementSummary = useExportAchievementSummary();
  const exportEventParticipation = useExportEventParticipation();
  const exportOrganizationReport = useExportOrganizationReport();

  const handleExportPerformance = () => {
    const params: any = {};
    if (selectedCourse !== "all") params.course_id = parseInt(selectedCourse);
    if (selectedYear !== "all") params.year_level = parseInt(selectedYear);
    if (selectedSemester !== "all") params.semester = parseInt(selectedSemester);
    exportStudentPerformance.mutate(params);
  };

  const handleExportAttendance = () => {
    exportAttendanceReport.mutate({});
  };

  const handleExportViolations = () => {
    exportViolationSummary.mutate({});
  };

  const handleExportAchievements = () => {
    exportAchievementSummary.mutate({});
  };

  const handleExportEvents = () => {
    exportEventParticipation.mutate({});
  };

  const handleExportOrganizations = () => {
    exportOrganizationReport.mutate({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">View and export academic and administrative reports</p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Student Performance Report
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportPerformance}
                  disabled={exportStudentPerformance.isPending}
                >
                  {exportStudentPerformance.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Year Level</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {[1, 2, 3, 4].map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}{y === 1 ? "st" : y === 2 ? "nd" : y === 3 ? "rd" : "th"} Year</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1">1st</SelectItem>
                      <SelectItem value="2">2nd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ScrollArea className="h-96">
                {loadingPerformance ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Avg Grade</TableHead>
                        <TableHead>Passing</TableHead>
                        <TableHead>Failing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPerformance?.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No data available</TableCell></TableRow>
                      ) : (
                        studentPerformance?.map((s: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{s.student_id}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.course}</TableCell>
                            <TableCell>{s.year_level}</TableCell>
                            <TableCell className={s.average_grade <= 3.0 ? "text-green-600" : "text-red-600"}>
                              {s.average_grade ? s.average_grade.toFixed(2) : "N/A"}
                            </TableCell>
                            <TableCell>{s.passing_subjects}</TableCell>
                            <TableCell>{s.failing_subjects}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance Report
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportAttendance}
                  disabled={exportAttendanceReport.isPending}
                >
                  {exportAttendanceReport.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {loadingAttendance ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Absent</TableHead>
                        <TableHead>Late</TableHead>
                        <TableHead>Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceReport?.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No data available</TableCell></TableRow>
                      ) : (
                        attendanceReport?.map((a: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{a.student_id}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell>{a.section}</TableCell>
                            <TableCell>{a.total_classes}</TableCell>
                            <TableCell className="text-green-600">{a.present}</TableCell>
                            <TableCell className="text-red-600">{a.absent}</TableCell>
                            <TableCell className="text-yellow-600">{a.late}</TableCell>
                            <TableCell>{a.attendance_rate}%</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Violation Summary
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportViolations}
                  disabled={exportViolationSummary.isPending}
                >
                  {exportViolationSummary.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingViolations ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{violationSummary?.total_violations || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Violations</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{violationSummary?.by_severity?.grave || 0}</p>
                      <p className="text-sm text-muted-foreground">Grave</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{violationSummary?.by_severity?.major || 0}</p>
                      <p className="text-sm text-muted-foreground">Major</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{violationSummary?.by_severity?.minor || 0}</p>
                      <p className="text-sm text-muted-foreground">Minor</p>
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {violationSummary?.recent_violations?.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No recent violations</TableCell></TableRow>
                        ) : (
                          violationSummary?.recent_violations?.map((v: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{v.student?.user?.name}</TableCell>
                              <TableCell>{v.type}</TableCell>
                              <TableCell><Badge variant={v.severity === 'grave' ? 'destructive' : v.severity === 'major' ? 'default' : 'secondary'}>{v.severity}</Badge></TableCell>
                              <TableCell><Badge variant={v.status === 'approved' ? 'default' : v.status === 'rejected' ? 'destructive' : 'secondary'}>{v.status}</Badge></TableCell>
                              <TableCell>{new Date(v.violation_date).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievement Summary
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportAchievements}
                  disabled={exportAchievementSummary.isPending}
                >
                  {exportAchievementSummary.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAchievements ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{achievementSummary?.total_achievements || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Achievements</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{achievementSummary?.by_status?.approved || 0}</p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{achievementSummary?.by_status?.pending || 0}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{achievementSummary?.top_students?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Top Students</p>
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {achievementSummary?.recent_achievements?.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No recent achievements</TableCell></TableRow>
                        ) : (
                          achievementSummary?.recent_achievements?.map((a: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{a.student?.user?.name}</TableCell>
                              <TableCell>{a.type}</TableCell>
                              <TableCell><Badge variant={a.status === 'approved' ? 'default' : 'secondary'}>{a.status}</Badge></TableCell>
                              <TableCell>{new Date(a.achievement_date).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Participation
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportEvents}
                  disabled={exportEventParticipation.isPending}
                >
                  {exportEventParticipation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {loadingEvents ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Attended</TableHead>
                        <TableHead>Absent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventParticipation?.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No events data</TableCell></TableRow>
                      ) : (
                        eventParticipation?.map((e: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{e.title}</TableCell>
                            <TableCell><Badge variant="outline">{e.type}</Badge></TableCell>
                            <TableCell>{e.participants_count || e.total_registered || 0}</TableCell>
                            <TableCell className="text-green-600">{e.attended || 0}</TableCell>
                            <TableCell className="text-red-600">{e.absent || 0}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Organization Report
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportOrganizations}
                  disabled={exportOrganizationReport.isPending}
                >
                  {exportOrganizationReport.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {loadingOrgs ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Adviser</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Officers</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizationReport?.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No organizations data</TableCell></TableRow>
                      ) : (
                        organizationReport?.map((o: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{o.name}</TableCell>
                            <TableCell><Badge variant="outline">{o.category}</Badge></TableCell>
                            <TableCell>{o.adviser}</TableCell>
                            <TableCell>{o.member_count}</TableCell>
                            <TableCell>{o.officers}</TableCell>
                            <TableCell><Badge variant={o.is_active ? "default" : "secondary"}>{o.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
