import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Edit2, Trash2, Clock, Users, 
  Loader2, User, BookOpen, Building2
} from "lucide-react";
import { 
  useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule,
  useSubjects, useSections, useFaculty, useRooms
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface ScheduleData {
  id: number;
  subject_id: number;
  faculty_id: number;
  section_id: number;
  room_id: number;
  day: string;
  start_time: string;
  end_time: string;
  academic_year: string;
  semester: number;
  subject: { id: number; name: string; code: string } | null;
  faculty: { id: number; user: { name: string } } | null;
  section: { id: number; name: string } | null;
  room: { id: number; name: string; code: string } | null;
}

const Scheduling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [viewType, setViewType] = useState<"subject" | "section" | "room" | "faculty">("subject");
  const [semesterFilter, setSemesterFilter] = useState("1");

  const { data: schedules, isLoading } = useSchedules();
  const { data: subjects } = useSubjects({ semester: semesterFilter });
  const { data: sections } = useSections();
  const { data: faculty } = useFaculty();
  const { data: rooms } = useRooms();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const { toast } = useToast();

  const [newScheduleForm, setNewScheduleForm] = useState({
    subject_id: "",
    faculty_id: "",
    section_id: "",
    room_id: "",
    day: "monday",
    start_time: "08:00",
    end_time: "09:00",
    academic_year: "2026-2027",
    semester: "1",
  });

  const [editForm, setEditForm] = useState({
    subject_id: "",
    faculty_id: "",
    section_id: "",
    room_id: "",
    day: "",
    start_time: "",
    end_time: "",
    academic_year: "",
    semester: "",
  });

  const resetForm = () => {
    setSemesterFilter("1");
    setNewScheduleForm({
      subject_id: "",
      faculty_id: "",
      section_id: "",
      room_id: "",
      day: "monday",
      start_time: "08:00",
      end_time: "09:00",
      academic_year: "2026-2027",
      semester: "1",
    });
  };

  const handleCreateSchedule = async () => {
    try {
      await createSchedule.mutateAsync({
        subject_id: parseInt(newScheduleForm.subject_id),
        faculty_id: parseInt(newScheduleForm.faculty_id),
        section_id: parseInt(newScheduleForm.section_id),
        room_id: parseInt(newScheduleForm.room_id),
        day: newScheduleForm.day,
        start_time: newScheduleForm.start_time,
        end_time: newScheduleForm.end_time,
        academic_year: newScheduleForm.academic_year,
        semester: parseInt(newScheduleForm.semester),
      });
      toast({ title: "Schedule created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating schedule", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEditClick = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule);
    setEditForm({
      subject_id: schedule.subject_id.toString(),
      faculty_id: schedule.faculty_id.toString(),
      section_id: schedule.section_id.toString(),
      room_id: schedule.room_id.toString(),
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      academic_year: schedule.academic_year,
      semester: schedule.semester.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) return;
    
    try {
      await updateSchedule.mutateAsync({
        id: selectedSchedule.id,
        schedule: {
          subject_id: parseInt(editForm.subject_id),
          faculty_id: parseInt(editForm.faculty_id),
          section_id: parseInt(editForm.section_id),
          room_id: parseInt(editForm.room_id),
          day: editForm.day,
          start_time: editForm.start_time,
          end_time: editForm.end_time,
          academic_year: editForm.academic_year,
          semester: parseInt(editForm.semester),
        }
      });
      toast({ title: "Schedule updated successfully" });
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
    } catch (error: any) {
      toast({ 
        title: "Error updating schedule", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteSchedule = async (schedule: ScheduleData) => {
    if (!confirm(`Are you sure you want to delete this schedule? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteSchedule.mutateAsync(schedule.id);
      toast({ title: "Schedule deleted successfully" });
    } catch (error: any) {
      toast({ 
        title: "Error deleting schedule", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const filteredSchedules = schedules?.filter((schedule: ScheduleData) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      schedule.subject?.name.toLowerCase().includes(searchLower) ||
      schedule.subject?.code.toLowerCase().includes(searchLower) ||
      schedule.section?.name.toLowerCase().includes(searchLower) ||
      schedule.room?.name.toLowerCase().includes(searchLower) ||
      schedule.faculty?.user.name.toLowerCase().includes(searchLower) ||
      schedule.day.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getFilteredByView = () => {
    if (viewType === "subject") return filteredSchedules.sort((a: any, b: any) => (a.subject?.name || "").localeCompare(b.subject?.name || ""));
    if (viewType === "section") return filteredSchedules.sort((a: any, b: any) => (a.section?.name || "").localeCompare(b.section?.name || ""));
    if (viewType === "room") return filteredSchedules.sort((a: any, b: any) => (a.room?.name || "").localeCompare(b.room?.name || ""));
    if (viewType === "faculty") return filteredSchedules.sort((a: any, b: any) => (a.faculty?.user.name || "").localeCompare(b.faculty?.user.name || ""));
    return filteredSchedules;
  };

  const displaySchedules = getFilteredByView();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Scheduling Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage class schedules with conflict detection</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>Create a new class schedule</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <ToggleGroup
                    type="single"
                    value={semesterFilter}
                    onValueChange={(value) => {
                      if (value) {
                        setSemesterFilter(value);
                        setNewScheduleForm({ ...newScheduleForm, semester: value, subject_id: "" });
                      }
                    }}
                    className="w-full"
                  >
                    <ToggleGroupItem value="1" className="flex-1">1st Semester</ToggleGroupItem>
                    <ToggleGroupItem value="2" className="flex-1">2nd Semester</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={newScheduleForm.subject_id} 
                    onValueChange={(value) => setNewScheduleForm({ ...newScheduleForm, subject_id: value })}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.code} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Select 
                    value={newScheduleForm.faculty_id} 
                    onValueChange={(value) => setNewScheduleForm({ ...newScheduleForm, faculty_id: value })}
                  >
                    <SelectTrigger id="faculty">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty?.map((f: any) => (
                        <SelectItem key={f.id} value={f.id.toString()}>
                          {f.user?.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select 
                    value={newScheduleForm.section_id} 
                    onValueChange={(value) => setNewScheduleForm({ ...newScheduleForm, section_id: value })}
                  >
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections?.map((section: any) => (
                        <SelectItem key={section.id} value={section.id.toString()}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Select 
                    value={newScheduleForm.room_id} 
                    onValueChange={(value) => setNewScheduleForm({ ...newScheduleForm, room_id: value })}
                  >
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms?.map((room: any) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.code} - {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={newScheduleForm.day} 
                    onValueChange={(value) => setNewScheduleForm({ ...newScheduleForm, day: value })}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={newScheduleForm.start_time}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={newScheduleForm.end_time}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    value={newScheduleForm.academic_year}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, academic_year: e.target.value })}
                    placeholder="2026-2027"
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateSchedule} disabled={createSchedule.isPending}>
                {createSchedule.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Add Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="subject">By Subject</TabsTrigger>
            <TabsTrigger value="section">By Section</TabsTrigger>
            <TabsTrigger value="room">By Room</TabsTrigger>
            <TabsTrigger value="faculty">By Faculty</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {viewType === "subject" && <><BookOpen className="h-4 w-4 mr-2 inline" />Subject</>}
                  {viewType === "section" && <><Users className="h-4 w-4 mr-2 inline" />Section</>}
                  {viewType === "room" && <><Building2 className="h-4 w-4 mr-2 inline" />Room</>}
                  {viewType === "faculty" && <><User className="h-4 w-4 mr-2 inline" />Faculty</>}
                </TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displaySchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No schedules found</TableCell>
                </TableRow>
              ) : (
                displaySchedules.map((schedule: ScheduleData) => (
                  <TableRow key={schedule.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {viewType === "subject" && (
                        <div>
                          <div className="font-mono text-sm">{schedule.subject?.code}</div>
                          <div className="text-sm text-muted-foreground">{schedule.subject?.name}</div>
                        </div>
                      )}
                      {viewType === "section" && (
                        <div>
                          <div>{schedule.section?.name}</div>
                          <div className="text-sm text-muted-foreground">{schedule.subject?.code}</div>
                        </div>
                      )}
                      {viewType === "room" && (
                        <div>
                          <div className="font-mono text-sm">{schedule.room?.code}</div>
                          <div className="text-sm text-muted-foreground">{schedule.room?.name}</div>
                        </div>
                      )}
                      {viewType === "faculty" && (
                        <div>
                          <div>{schedule.faculty?.user.name}</div>
                          <div className="text-sm text-muted-foreground">{schedule.subject?.code}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {schedule.day}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.academic_year}</TableCell>
                    <TableCell>{schedule.semester === 1 ? '1st' : '2nd'} Semester</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(schedule)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteSchedule(schedule)}
                          disabled={deleteSchedule.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update the schedule information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_subject">Subject</Label>
                <Select 
                  value={editForm.subject_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, subject_id: value })}
                >
                  <SelectTrigger id="edit_subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_faculty">Faculty</Label>
                <Select 
                  value={editForm.faculty_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, faculty_id: value })}
                >
                  <SelectTrigger id="edit_faculty">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty?.map((f: any) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.user?.name || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_section">Section</Label>
                <Select 
                  value={editForm.section_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, section_id: value })}
                >
                  <SelectTrigger id="edit_section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((section: any) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_room">Room</Label>
                <Select 
                  value={editForm.room_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, room_id: value })}
                >
                  <SelectTrigger id="edit_room">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms?.map((room: any) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.code} - {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_day">Day</Label>
                  <Select 
                    value={editForm.day} 
                    onValueChange={(value) => setEditForm({ ...editForm, day: value })}
                  >
                    <SelectTrigger id="edit_day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_semester">Semester</Label>
                  <Select 
                    value={editForm.semester} 
                    onValueChange={(value) => setEditForm({ ...editForm, semester: value })}
                  >
                    <SelectTrigger id="edit_semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_start_time">Start Time</Label>
                  <Input
                    id="edit_start_time"
                    type="time"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_end_time">End Time</Label>
                  <Input
                    id="edit_end_time"
                    type="time"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_academic_year">Academic Year</Label>
                <Input
                  id="edit_academic_year"
                  value={editForm.academic_year}
                  onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })}
                  placeholder="2026-2027"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedSchedule(null); }}>Cancel</Button>
            <Button onClick={handleUpdateSchedule} disabled={updateSchedule.isPending}>
              {updateSchedule.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scheduling;
