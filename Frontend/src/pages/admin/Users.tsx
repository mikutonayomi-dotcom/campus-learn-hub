import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, UserPlus, Eye, Edit2, GraduationCap, BookOpen, Loader2, 
  Mail, Phone, Building, User, EyeOff 
} from "lucide-react";
import { 
  useStudents, useFaculty, useCourses, useSections,
  useCreateStudent, useCreateFaculty, 
  useUpdateStudent, useUpdateFaculty,
  useNextStudentId, useNextFacultyId
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import StudentProfileView from "@/components/StudentProfileView";

type UserType = "student" | "faculty";

interface StudentData {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
  student_id: string;
  course_id: number;
  course: { id: number; name: string } | null;
  section_id: number | null;
  section: { id: number; name: string; course_id: number; year_level: number } | null;
  year_level: number;
  contact_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  status: string;
}

interface FacultyData {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
  employee_id: string;
  department: string;
  position: string;
  specialization?: string;
  contact_number?: string;
  office_location?: string;
  is_active: boolean;
}

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState<UserType>("student");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<StudentData | FacultyData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Student Profile View states
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);
  
  const { toast } = useToast();
  
  const { data: students, isLoading: studentsLoading } = useStudents(searchTerm ? { search: searchTerm } : undefined);
  const { data: faculty, isLoading: facultyLoading } = useFaculty();
  const { data: courses } = useCourses();
  const { data: sections } = useSections();
  const { data: nextStudentId, refetch: refetchNextStudentId } = useNextStudentId();
  const { data: nextFacultyId, refetch: refetchNextFacultyId } = useNextFacultyId();
  
  const createStudent = useCreateStudent();
  const createFaculty = useCreateFaculty();
  const updateStudent = useUpdateStudent();
  const updateFaculty = useUpdateFaculty();

  // Form states for creating new user
  const [newUserForm, setNewUserForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    password: "",
    role: "student" as UserType,
    student_id: "",
    course_id: "",
    section_id: "",
    year_level: "1",
    contact_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    employee_id: "",
    department: "",
    position: "",
    specialization: "",
    office_location: "",
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    course_id: "",
    section_id: "",
    year_level: "",
    contact_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    department: "",
    position: "",
    specialization: "",
    contact_number_faculty: "",
    office_location: "",
  });

  const isLoading = activeTab === "student" ? studentsLoading : facultyLoading;

  // Auto-populate IDs when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      if (newUserForm.role === "student" && nextStudentId) {
        setNewUserForm(prev => ({ ...prev, student_id: nextStudentId }));
      } else if (newUserForm.role === "faculty" && nextFacultyId) {
        setNewUserForm(prev => ({ ...prev, employee_id: nextFacultyId }));
      }
    }
  }, [isCreateModalOpen, nextStudentId, nextFacultyId, newUserForm.role]);

  // Refetch IDs when role changes
  useEffect(() => {
    if (isCreateModalOpen) {
      if (newUserForm.role === "student") {
        refetchNextStudentId();
      } else {
        refetchNextFacultyId();
      }
    }
  }, [newUserForm.role, isCreateModalOpen, refetchNextStudentId, refetchNextFacultyId]);

  const handleCreateUser = async () => {
    try {
      if (newUserForm.role === "student") {
        await createStudent.mutateAsync({
          firstname: newUserForm.firstname,
          middlename: newUserForm.middlename || null,
          lastname: newUserForm.lastname,
          suffix: newUserForm.suffix || null,
          email: newUserForm.email,
          password: newUserForm.password,
          student_id: newUserForm.student_id,
          course_id: parseInt(newUserForm.course_id),
          section_id: newUserForm.section_id ? parseInt(newUserForm.section_id) : null,
          year_level: parseInt(newUserForm.year_level),
          contact_number: newUserForm.contact_number || null,
          address: newUserForm.address || null,
          emergency_contact_name: newUserForm.emergency_contact_name || null,
          emergency_contact_number: newUserForm.emergency_contact_number || null,
        });
        const fullName = `${newUserForm.firstname} ${newUserForm.middlename ? newUserForm.middlename + ' ' : ''}${newUserForm.lastname}${newUserForm.suffix ? ' ' + newUserForm.suffix : ''}`;
        toast({ title: "Student created successfully", description: `${fullName} has been added.` });
      } else {
        await createFaculty.mutateAsync({
          firstname: newUserForm.firstname,
          middlename: newUserForm.middlename || null,
          lastname: newUserForm.lastname,
          suffix: newUserForm.suffix || null,
          email: newUserForm.email,
          password: newUserForm.password,
          employee_id: newUserForm.employee_id,
          department: newUserForm.department,
          position: newUserForm.position,
          specialization: newUserForm.specialization || null,
          contact_number: newUserForm.contact_number || null,
          office_location: newUserForm.office_location || null,
        });
        const fullName = `${newUserForm.firstname} ${newUserForm.middlename ? newUserForm.middlename + ' ' : ''}${newUserForm.lastname}${newUserForm.suffix ? ' ' + newUserForm.suffix : ''}`;
        toast({ title: "Faculty created successfully", description: `${fullName} has been added.` });
      }
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating user", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      if ('student_id' in selectedUser) {
        await updateStudent.mutateAsync({
          id: selectedUser.id,
          student: {
            course_id: editForm.course_id ? parseInt(editForm.course_id) : undefined,
            section_id: editForm.section_id ? parseInt(editForm.section_id) : null,
            year_level: parseInt(editForm.year_level),
            contact_number: editForm.contact_number || null,
            address: editForm.address || null,
            emergency_contact_name: editForm.emergency_contact_name || null,
            emergency_contact_number: editForm.emergency_contact_number || null,
          }
        });
      } else {
        await updateFaculty.mutateAsync({
          id: selectedUser.id,
          faculty: {
            department: editForm.department,
            position: editForm.position,
            specialization: editForm.specialization || null,
            contact_number: editForm.contact_number_faculty || null,
            office_location: editForm.office_location || null,
          }
        });
      }
      toast({ title: "User updated successfully" });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({ 
        title: "Error updating user", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    setNewUserForm({
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
      email: "",
      password: "",
      role: "student",
      student_id: "",
      course_id: "",
      section_id: "",
      year_level: "1",
      contact_number: "",
      address: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      employee_id: "",
      department: "",
      position: "",
      specialization: "",
      office_location: "",
    });
    setShowPassword(false);
  };

  const handleViewDetails = (user: StudentData | FacultyData) => {
    if ('student_id' in user) {
      // Use comprehensive profile view for students
      setSelectedStudentId(user.id);
      setIsStudentProfileOpen(true);
    } else {
      // Use existing dialog for faculty
      setSelectedUser(user);
      setIsViewModalOpen(true);
    }
  };

  const handleEditClick = (user: StudentData | FacultyData) => {
    setSelectedUser(user);
    if ('student_id' in user) {
      setEditForm({
        name: user.user.name,
        email: user.user.email,
        course_id: user.course_id?.toString() || "",
        section_id: user.section_id?.toString() || "",
        year_level: user.year_level.toString(),
        contact_number: user.contact_number || "",
        address: user.address || "",
        emergency_contact_name: user.emergency_contact_name || "",
        emergency_contact_number: user.emergency_contact_number || "",
        department: "",
        position: "",
        specialization: "",
        contact_number_faculty: "",
        office_location: "",
      });
    } else {
      setEditForm({
        name: user.user.name,
        email: user.user.email,
        course_id: "",
        section_id: "",
        year_level: "",
        contact_number: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        department: user.department,
        position: user.position,
        specialization: user.specialization || "",
        contact_number_faculty: user.contact_number || "",
        office_location: user.office_location || "",
      });
    }
    setIsEditModalOpen(true);
  };

  const filteredStudents = students?.filter((s: StudentData) => 
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredFaculty = faculty?.filter((f: FacultyData) => 
    f.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const displayData = activeTab === "student" ? filteredStudents : filteredFaculty;

  // Get available sections for selected course and year level
  const availableSectionsForCreate = sections?.filter((s: any) => 
    newUserForm.course_id && 
    newUserForm.year_level &&
    s.course_id === parseInt(newUserForm.course_id) &&
    s.year_level === parseInt(newUserForm.year_level)
  ) || [];

  // Get available sections for edit form
  const availableSectionsForEdit = sections?.filter((s: any) => 
    editForm.course_id && 
    editForm.year_level &&
    s.course_id === parseInt(editForm.course_id) &&
    s.year_level === parseInt(editForm.year_level)
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage students, faculty, and admin accounts</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-200 hover:scale-105">
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="user_type">User Type</Label>
                  <Select 
                    value={newUserForm.role} 
                    onValueChange={(value: UserType) => {
                      setNewUserForm({ ...newUserForm, role: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      autoComplete="given-name"
                      value={newUserForm.firstname}
                      onChange={(e) => setNewUserForm({ ...newUserForm, firstname: e.target.value })}
                      placeholder="Juan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middlename">Middle Name (Optional)</Label>
                    <Input
                      id="middlename"
                      name="middlename"
                      autoComplete="additional-name"
                      value={newUserForm.middlename}
                      onChange={(e) => setNewUserForm({ ...newUserForm, middlename: e.target.value })}
                      placeholder="Garcia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      autoComplete="family-name"
                      value={newUserForm.lastname}
                      onChange={(e) => setNewUserForm({ ...newUserForm, lastname: e.target.value })}
                      placeholder="Dela Cruz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suffix">Suffix (Optional)</Label>
                    <Select 
                      value={newUserForm.suffix || "none"} 
                      onValueChange={(value) => setNewUserForm({ ...newUserForm, suffix: value === "none" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select suffix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Jr.">Jr.</SelectItem>
                        <SelectItem value="Sr.">Sr.</SelectItem>
                        <SelectItem value="II">II</SelectItem>
                        <SelectItem value="III">III</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@uc.edu.ph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      placeholder="Minimum 8 characters"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Role-specific fields */}
                {newUserForm.role === "student" ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Student Information
                    </h4>
                    
                    {/* Auto-generated Student ID */}
                    <div className="space-y-2">
                      <Label htmlFor="student_id">Student ID (Auto-generated)</Label>
                      <Input
                        id="student_id"
                        name="student_id"
                        value={newUserForm.student_id}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Select 
                        value={newUserForm.course_id} 
                        onValueChange={(value) => setNewUserForm({ ...newUserForm, course_id: value, section_id: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses?.map((course: any) => (
                            <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year_level">Year Level</Label>
                      <Select 
                        value={newUserForm.year_level} 
                        onValueChange={(value) => setNewUserForm({ ...newUserForm, year_level: value, section_id: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select 
                        value={newUserForm.section_id} 
                        onValueChange={(value) => setNewUserForm({ ...newUserForm, section_id: value })}
                        disabled={!newUserForm.course_id || !newUserForm.year_level || availableSectionsForCreate.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !newUserForm.course_id || !newUserForm.year_level 
                              ? "Select course and year first" 
                              : availableSectionsForCreate.length === 0 
                                ? "No sections available" 
                                : "Select section"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSectionsForCreate.map((section: any) => (
                            <SelectItem key={section.id} value={section.id.toString()}>
                              {section.name} (Capacity: {section.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {availableSectionsForCreate.length === 0 && newUserForm.course_id && newUserForm.year_level && (
                        <p className="text-xs text-muted-foreground">
                          No sections available for this course and year level. Please create a section first.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        name="contact_number"
                        type="tel"
                        autoComplete="tel"
                        value={newUserForm.contact_number}
                        onChange={(e) => setNewUserForm({ ...newUserForm, contact_number: e.target.value })}
                        placeholder="09123456789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        autoComplete="street-address"
                        value={newUserForm.address}
                        onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
                        placeholder="Complete address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                        <Input
                          id="emergency_name"
                          name="emergency_contact_name"
                          autoComplete="name"
                          value={newUserForm.emergency_contact_name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, emergency_contact_name: e.target.value })}
                          placeholder="Parent/Guardian name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency_number">Emergency Contact Number</Label>
                        <Input
                          id="emergency_number"
                          name="emergency_contact_number"
                          type="tel"
                          autoComplete="tel"
                          value={newUserForm.emergency_contact_number}
                          onChange={(e) => setNewUserForm({ ...newUserForm, emergency_contact_number: e.target.value })}
                          placeholder="09123456789"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Faculty Information
                    </h4>

                    {/* Auto-generated Employee ID */}
                    <div className="space-y-2">
                      <Label htmlFor="employee_id">Employee ID (Auto-generated)</Label>
                      <Input
                        id="employee_id"
                        name="employee_id"
                        value={newUserForm.employee_id}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={newUserForm.department}
                          onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                          placeholder="CCS"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select 
                          value={newUserForm.position} 
                          onValueChange={(value) => setNewUserForm({ ...newUserForm, position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professor">Professor</SelectItem>
                            <SelectItem value="Instructor">Instructor</SelectItem>
                            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                            <SelectItem value="Lecturer">Lecturer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        value={newUserForm.specialization}
                        onChange={(e) => setNewUserForm({ ...newUserForm, specialization: e.target.value })}
                        placeholder="e.g. Web Development"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty_contact">Contact Number</Label>
                        <Input
                          id="faculty_contact"
                          name="contact_number"
                          type="tel"
                          autoComplete="tel"
                          value={newUserForm.contact_number}
                          onChange={(e) => setNewUserForm({ ...newUserForm, contact_number: e.target.value })}
                          placeholder="09123456789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office">Office Location</Label>
                        <Input
                          id="office"
                          name="office_location"
                          value={newUserForm.office_location}
                          onChange={(e) => setNewUserForm({ ...newUserForm, office_location: e.target.value })}
                          placeholder="Building Room 101"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={createStudent.isPending || createFaculty.isPending}>
                {(createStudent.isPending || createFaculty.isPending) ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="student" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Students ({filteredStudents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="faculty" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Faculty ({filteredFaculty?.length || 0})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>{activeTab === "student" ? "Student ID" : "Employee ID"}</TableHead>
                  <TableHead>{activeTab === "student" ? "Course" : "Department"}</TableHead>
                  <TableHead>{activeTab === "student" ? "Section" : "Position"}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No {activeTab} found</TableCell>
                  </TableRow>
                ) : (
                  displayData.map((user: StudentData | FacultyData) => {
                    const isStudent = 'student_id' in user;
                    return (
                      <TableRow key={user.id} className="transition-colors duration-150 hover:bg-muted/50">
                        <TableCell className="font-medium">{user.user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.user.email}</TableCell>
                        <TableCell>{isStudent ? (user as StudentData).student_id : (user as FacultyData).employee_id}</TableCell>
                        <TableCell>{isStudent ? ((user as StudentData).course?.name || "-") : (user as FacultyData).department}</TableCell>
                        <TableCell>{isStudent ? (user as StudentData).section?.name || "-" : (user as FacultyData).position}</TableCell>
                        <TableCell>
                          <Badge variant={user.user.is_active ? "default" : "secondary"} className="capitalize">
                            {user.user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditClick(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Faculty Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.user.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedUser.user.email}</p>
                  <Badge variant={selectedUser.user.is_active ? "default" : "secondary"} className="mt-2">
                    {selectedUser.user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Separator />
              {/* Type assertion for faculty data since this dialog is only for faculty */}
              {(() => {
                const facultyUser = selectedUser as FacultyData;
                return (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Employment Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Employee ID</p><p className="font-medium">{facultyUser.employee_id}</p></div>
                      <div><p className="text-muted-foreground">Department</p><p className="font-medium">{facultyUser.department}</p></div>
                      <div><p className="text-muted-foreground">Position</p><p className="font-medium">{facultyUser.position}</p></div>
                      <div><p className="text-muted-foreground">Specialization</p><p className="font-medium">{facultyUser.specialization || "-"}</p></div>
                    </div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mt-4">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" />{facultyUser.contact_number || "Not provided"}</p>
                      <p className="flex items-center gap-2"><Building className="h-3 w-3 text-muted-foreground" />{facultyUser.office_location || "Not provided"}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comprehensive Student Profile Modal */}
      <StudentProfileView 
        studentId={selectedStudentId}
        isOpen={isStudentProfileOpen}
        onClose={() => {
          setIsStudentProfileOpen(false);
          setSelectedStudentId(null);
        }}
      />

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit {selectedUser && ('student_id' in selectedUser ? 'Student' : 'Faculty')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              {selectedUser && 'student_id' in selectedUser ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit_student_id">Student ID</Label>
                    <Input id="edit_student_id" name="student_id" value={selectedUser.student_id} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_course">Course</Label>
                    <Select 
                      value={editForm.course_id} 
                      onValueChange={(value) => setEditForm({ ...editForm, course_id: value, section_id: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course: any) => (
                          <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_year_level">Year Level</Label>
                    <Select 
                      value={editForm.year_level} 
                      onValueChange={(value) => setEditForm({ ...editForm, year_level: value, section_id: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
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
                      disabled={!editForm.course_id || !editForm.year_level || availableSectionsForEdit.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !editForm.course_id || !editForm.year_level 
                            ? "Select course and year first" 
                            : availableSectionsForEdit.length === 0 
                              ? "No sections available" 
                              : "Select section"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSectionsForEdit.map((section: any) => (
                          <SelectItem key={section.id} value={section.id.toString()}>
                            {section.name} (Capacity: {section.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableSectionsForEdit.length === 0 && editForm.course_id && editForm.year_level && (
                      <p className="text-xs text-muted-foreground">
                        No sections available for this course and year level.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_contact">Contact Number</Label>
                    <Input 
                      id="edit_contact"
                      name="contact_number"
                      type="tel"
                      autoComplete="tel"
                      value={editForm.contact_number} 
                      onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_address">Address</Label>
                    <Input 
                      id="edit_address"
                      name="address"
                      autoComplete="street-address"
                      value={editForm.address} 
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_emergency_name">Emergency Contact Name</Label>
                    <Input 
                      id="edit_emergency_name"
                      name="emergency_contact_name"
                      autoComplete="name"
                      value={editForm.emergency_contact_name} 
                      onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_emergency_number">Emergency Contact Number</Label>
                    <Input 
                      id="edit_emergency_number"
                      name="emergency_contact_number"
                      type="tel"
                      autoComplete="tel"
                      value={editForm.emergency_contact_number} 
                      onChange={(e) => setEditForm({ ...editForm, emergency_contact_number: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit_employee_id">Employee ID</Label>
                    <Input id="edit_employee_id" name="employee_id" value={selectedUser?.employee_id || ''} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_department">Department</Label>
                    <Input 
                      id="edit_department"
                      name="department"
                      value={editForm.department} 
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_position">Position</Label>
                    <Select 
                      value={editForm.position} 
                      onValueChange={(value) => setEditForm({ ...editForm, position: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Instructor">Instructor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_specialization">Specialization</Label>
                    <Input 
                      id="edit_specialization"
                      name="specialization"
                      value={editForm.specialization} 
                      onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_faculty_contact">Contact Number</Label>
                    <Input 
                      id="edit_faculty_contact"
                      name="contact_number"
                      type="tel"
                      autoComplete="tel"
                      value={editForm.contact_number_faculty} 
                      onChange={(e) => setEditForm({ ...editForm, contact_number_faculty: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_office">Office Location</Label>
                    <Input 
                      id="edit_office"
                      name="office_location"
                      value={editForm.office_location} 
                      onChange={(e) => setEditForm({ ...editForm, office_location: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditUser}
              disabled={updateStudent.isPending || updateFaculty.isPending}
            >
              {(updateStudent.isPending || updateFaculty.isPending) ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
