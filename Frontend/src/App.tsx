import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminSections from "./pages/admin/Sections";
import AdminCourseSubjects from "./pages/admin/CourseSubjects";
import AdminRooms from "./pages/admin/Rooms";
import AdminScheduling from "./pages/admin/Scheduling";
import AdminViolations from "./pages/admin/Violations";
import AdminOrganizations from "./pages/admin/Organizations";
import AdminEvents from "./pages/admin/Events";
import AdminReports from "./pages/admin/Reports";
import FacultyStudents from "./pages/faculty/Students";
import FacultyViolations from "./pages/faculty/Violations";
import FacultyAchievements from "./pages/faculty/Achievements";
import FacultyCourses from "./pages/faculty/Courses";
import FacultyCourseDetail from "./pages/faculty/CourseDetail";
import FacultySubjects from "./pages/faculty/Subjects";
import FacultySubjectDetail from "./pages/faculty/SubjectDetail";
import FacultyProfile from "./pages/faculty/Profile";
import FacultySchedule from "./pages/faculty/Schedule";
import FacultyEvents from "./pages/faculty/Events";
import FacultyReports from "./pages/faculty/Reports";
import StudentProfile from "./pages/student/Profile";
import StudentAcademics from "./pages/student/Academics";
import StudentSubjectDetail from "./pages/student/SubjectDetail";
import StudentSchedule from "./pages/student/Schedule";
import StudentViolations from "./pages/student/Violations";
import StudentAchievements from "./pages/student/Achievements";
import StudentEvents from "./pages/student/Events";
import StudentOrganizations from "./pages/student/Organizations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout role="admin" /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="course-subjects" element={<AdminCourseSubjects />} />
                <Route path="sections" element={<AdminSections />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="scheduling" element={<AdminScheduling />} />
                <Route path="violations" element={<AdminViolations />} />
                <Route path="organizations" element={<AdminOrganizations />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Faculty Routes */}
              <Route path="/faculty" element={<ProtectedRoute allowedRoles={["faculty"]}><DashboardLayout role="faculty" /></ProtectedRoute>}>
                <Route index element={<FacultyDashboard />} />
                <Route path="students" element={<FacultyStudents />} />
                <Route path="violations" element={<FacultyViolations />} />
                <Route path="achievements" element={<FacultyAchievements />} />
                <Route path="courses" element={<FacultyCourses />} />
                <Route path="courses/:subjectId/:sectionId" element={<FacultyCourseDetail />} />
                <Route path="subjects" element={<FacultySubjects />} />
                <Route path="subjects/:subjectId" element={<FacultySubjectDetail />} />
                <Route path="profile" element={<FacultyProfile />} />
                <Route path="schedule" element={<FacultySchedule />} />
                <Route path="events" element={<FacultyEvents />} />
                <Route path="reports" element={<FacultyReports />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><DashboardLayout role="student" /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="academics" element={<StudentAcademics />} />
                <Route path="academics/:subjectId" element={<StudentSubjectDetail />} />
                <Route path="schedule" element={<StudentSchedule />} />
                <Route path="violations" element={<StudentViolations />} />
                <Route path="achievements" element={<StudentAchievements />} />
                <Route path="events" element={<StudentEvents />} />
                <Route path="organizations" element={<StudentOrganizations />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
