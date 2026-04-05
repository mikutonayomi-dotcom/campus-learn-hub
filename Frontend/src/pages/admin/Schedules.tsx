import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, Plus, Edit2, Trash2, Calendar, Clock, Loader2, MapPin, Users, BookOpen, AlertCircle 
} from "lucide-react";
import { 
  useSchedules, useSubjects, useSections, useFaculty, useRooms,
  useCreateSchedule, useUpdateSchedule, useDeleteSchedule 
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface ScheduleData {
  id: number;
  subject_id: number;
  section_id: number;
  faculty_id: number;
  room_id: number;
  day: string;
  start_time: string;
  end_time: string;
  academic_year: string;
  semester: number;
  subject: { id: number; name: string; code: string };
  section: { id: number; name: string; course: { code: string }; year_level: number; capacity: number };
  faculty: { id: number; employee_id: string; user: { name: string } };
  room: { id: number; name: string; code: string; capacity: number; type: string };
}

interface SubjectData {
  id: number;
  name: string;
  code: string;
}

interface SectionData {
  id: number;
  name: string;
  year_level: number;
  capacity: number;
  course: { code: string; name: string };
}

interface FacultyData {
  id: number;
  employee_id: string;
  user: { name: string; email: string };
}

interface RoomData {
  id: number;
  name: string;
  code: string;
  capacity: number;
  type: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SEMESTERS = [1, 2];

const AdminSchedules = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: sections, isLoading: sectionsLoading } = useSections();
  const { data: faculty, isLoading: facultyLoading } = useFaculty();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  // Form states
  const [scheduleForm, setScheduleForm] = useState({
    subject_id: "",
    section_id: "",
    faculty_id: "",
    room_id: "",
    day: "monday",
    start_time: "08:00",
    end_time: "09:00",
    academic_year: "2024-2025",
    semester: 1,
  });

  // Set default academic year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setScheduleForm(prev => ({ 
      ...prev, 
      academic_year: `${currentYear}-${currentYear + 1}` 
    }));
  }, []);

  // Check capacity when section or room changes
  useEffect(() => {
    if (scheduleForm.section_id && scheduleForm.room_id) {
      const section = sections?.find((s: SectionData) => s.id.toString() === scheduleForm.section_id);
      const room = rooms?.find((r: RoomData) => r.id.toString() === scheduleForm.room_id);
      
      if (section && room && section.capacity > room.capacity) {
        setCapacityError(
          `Section capacity (${section.capacity}) exceeds room capacity (${room.capacity})`
        );
      } else {
        setCapacityError(null);
      }
    }
  }, [scheduleForm.section_id, scheduleForm.room_id, sections, rooms]);

  const filteredSchedules = schedules?.filter((schedule: ScheduleData) => {
    const matchesSearch = 
      schedule.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.section?.course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.faculty?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.room?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || schedule.subject_id.toString() === selectedSubject;
    const matchesSection = selectedSection === "all" || schedule.section_id.toString() === selectedSection;
    const matchesFaculty = selectedFaculty === "all" || schedule.faculty_id.toString() === selectedFaculty;
    const matchesRoom = selectedRoom === "all" || schedule.room_id.toString() === selectedRoom;
    const matchesDay = selectedDay === "all" || schedule.day === selectedDay;
    return matchesSearch && matchesSubject && matchesSection && matchesFaculty && matchesRoom && matchesDay;
  });

  const resetForm = () => {
    const currentYear = new Date().getFullYear();
    setScheduleForm({
      subject_id: "",
      section_id: "",
      faculty_id: "",
      room_id: "",
      day: "monday",
      start_time: "08:00",
      end_time: "09:00",
      academic_year: `${currentYear}-${currentYear + 1}`,
      semester: 1,
    });
    setCapacityError(null);
  };

  const handleCreateSchedule = async () => {
    if (capacityError) {
      toast({ 
        title: "Cannot create schedule", 
        description: capacityError,
        variant: "destructive"
      });
      return;
    }

    try {
      await createSchedule.mutateAsync({
        ...scheduleForm,
        subject_id: parseInt(scheduleForm.subject_id),
        section_id: parseInt(scheduleForm.section_id),
        faculty_id: parseInt(scheduleForm.faculty_id),
        room_id: parseInt(scheduleForm.room_id),
        semester: parseInt(scheduleForm.semester.toString()),
      });
      toast({ title: "Schedule created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating schedule", 
        description: error.response?.data?.message || error.response?.data?.error || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) return;
    if (capacityError) {
      toast({ 
        title: "Cannot update schedule", 
        description: capacityError,
        variant: "destructive"
      });
      return;
    }

    try {
      await updateSchedule.mutateAsync({ 
        id: selectedSchedule.id, 
        schedule: scheduleForm 
      });
      toast({ title: "Schedule updated successfully" });
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error updating schedule", 
        description: error.response?.data?.message || error.response?.data?.error || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) return;
    try {
      await deleteSchedule.mutateAsync(selectedSchedule.id);
      toast({ title: "Schedule deleted successfully" });
      setIsDeleteModalOpen(false);
      setSelectedSchedule(null);
    } catch (error: any) {
      toast({ 
        title: "Error deleting schedule", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule);
    setScheduleForm({
      subject_id: schedule.subject_id.toString(),
      section_id: schedule.section_id.toString(),
      faculty_id: schedule.faculty_id.toString(),
      room_id: schedule.room_id.toString(),
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      academic_year: schedule.academic_year,
      semester: schedule.semester,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (schedulesLoading || subjectsLoading || sectionsLoading || facultyLoading || roomsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Schedule Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage class schedules, faculty assignments, and room allocations
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <Separator />

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects?.map((subject: SubjectData) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections?.map((section: SectionData) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.course?.code} {section.year_level}-{section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculty</SelectItem>
                {faculty?.map((f: FacultyData) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms?.map((room: RoomData) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {DAYS.map(day => (
                  <SelectItem key={day} value={day}>
                    {formatDay(day)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary">
              {filteredSchedules?.length || 0} Schedules
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules?.map((schedule: ScheduleData) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{schedule.subject?.name}</div>
                          <div className="text-xs text-muted-foreground">{schedule.subject?.code}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{schedule.section?.course?.code} {schedule.section?.year_level}-{schedule.section?.name}</div>
                          <div className="text-xs text-muted-foreground">{schedule.section?.capacity} students</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {schedule.faculty?.user?.name?.charAt(0)}
                        </div>
                        {schedule.faculty?.user?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{schedule.room?.name}</div>
                          <div className="text-xs text-muted-foreground">Cap: {schedule.room?.capacity}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Badge variant="outline" className="text-xs">{formatDay(schedule.day)}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Semester {schedule.semester}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal(schedule)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteModal(schedule)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSchedules?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No schedules found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Schedule Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {capacityError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{capacityError}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={scheduleForm.subject_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, subject_id: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject: SubjectData) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select 
                  value={scheduleForm.section_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, section_id: value })}
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((section: SectionData) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.course?.code} {section.year_level}-{section.name} ({section.capacity} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Select 
                  value={scheduleForm.faculty_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, faculty_id: value })}
                >
                  <SelectTrigger id="faculty">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty?.map((f: FacultyData) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select 
                  value={scheduleForm.room_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, room_id: value })}
                >
                  <SelectTrigger id="room">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms?.map((room: RoomData) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.code} - {room.name} (Cap: {room.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select 
                  value={scheduleForm.day} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, day: value })}
                >
                  <SelectTrigger id="day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day}>
                        {formatDay(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  value={scheduleForm.academic_year}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, academic_year: e.target.value })}
                  placeholder="e.g., 2024-2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select 
                  value={scheduleForm.semester.toString()} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, semester: parseInt(value) })}
                >
                  <SelectTrigger id="semester">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSchedule}
              disabled={
                !scheduleForm.subject_id || 
                !scheduleForm.section_id || 
                !scheduleForm.faculty_id || 
                !scheduleForm.room_id ||
                !!capacityError ||
                createSchedule.isPending
              }
            >
              {createSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {capacityError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{capacityError}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Select 
                  value={scheduleForm.subject_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, subject_id: value })}
                >
                  <SelectTrigger id="edit-subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject: SubjectData) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-section">Section</Label>
                <Select 
                  value={scheduleForm.section_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, section_id: value })}
                >
                  <SelectTrigger id="edit-section">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((section: SectionData) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.course?.code} {section.year_level}-{section.name} ({section.capacity} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-faculty">Faculty</Label>
                <Select 
                  value={scheduleForm.faculty_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, faculty_id: value })}
                >
                  <SelectTrigger id="edit-faculty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty?.map((f: FacultyData) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room">Room</Label>
                <Select 
                  value={scheduleForm.room_id} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, room_id: value })}
                >
                  <SelectTrigger id="edit-room">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms?.map((room: RoomData) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.code} - {room.name} (Cap: {room.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-day">Day</Label>
                <Select 
                  value={scheduleForm.day} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, day: value })}
                >
                  <SelectTrigger id="edit-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day}>
                        {formatDay(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start_time">Start Time</Label>
                <Input
                  id="edit-start_time"
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_time">End Time</Label>
                <Input
                  id="edit-end_time"
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-academic_year">Academic Year</Label>
                <Input
                  id="edit-academic_year"
                  value={scheduleForm.academic_year}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, academic_year: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-semester">Semester</Label>
                <Select 
                  value={scheduleForm.semester.toString()} 
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, semester: parseInt(value) })}
                >
                  <SelectTrigger id="edit-semester">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSchedule}
              disabled={!!capacityError || updateSchedule.isPending}
            >
              {updateSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this schedule for <strong>{selectedSchedule?.subject?.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteSchedule}
              disabled={deleteSchedule.isPending}
            >
              {deleteSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSchedules;
