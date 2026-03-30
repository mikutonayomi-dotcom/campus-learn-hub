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
import AdminLogs from "./pages/admin/Logs";
import AdminApprovals from "./pages/admin/Approvals";
import AdminAcademics from "./pages/admin/Academics";
import AdminScheduling from "./pages/admin/Scheduling";
import AdminFacilities from "./pages/admin/Facilities";
import AdminEvents from "./pages/admin/Events";
import AdminSearch from "./pages/admin/Search";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import FacultyStudents from "./pages/faculty/Students";
import FacultyViolations from "./pages/faculty/Violations";
import FacultyAchievements from "./pages/faculty/Achievements";
import FacultyCourses from "./pages/faculty/Courses";
import FacultySubmissions from "./pages/faculty/Submissions";
import FacultySchedule from "./pages/faculty/Schedule";
import FacultyEvents from "./pages/faculty/Events";
import FacultyReports from "./pages/faculty/Reports";
import StudentProfile from "./pages/student/Profile";
import StudentAcademics from "./pages/student/Academics";
import StudentMaterials from "./pages/student/Materials";
import StudentSubmissions from "./pages/student/Submissions";
import StudentViolations from "./pages/student/Violations";
import StudentAchievements from "./pages/student/Achievements";
import StudentEvents from "./pages/student/Events";
import StudentOrganizations from "./pages/student/Organizations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout role="admin" /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="approvals" element={<AdminApprovals />} />
                <Route path="academics" element={<AdminAcademics />} />
                <Route path="scheduling" element={<AdminScheduling />} />
                <Route path="facilities" element={<AdminFacilities />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="search" element={<AdminSearch />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Faculty Routes */}
              <Route path="/faculty" element={<ProtectedRoute allowedRoles={["faculty"]}><DashboardLayout role="faculty" /></ProtectedRoute>}>
                <Route index element={<FacultyDashboard />} />
                <Route path="students" element={<FacultyStudents />} />
                <Route path="violations" element={<FacultyViolations />} />
                <Route path="achievements" element={<FacultyAchievements />} />
                <Route path="courses" element={<FacultyCourses />} />
                <Route path="submissions" element={<FacultySubmissions />} />
                <Route path="schedule" element={<FacultySchedule />} />
                <Route path="events" element={<FacultyEvents />} />
                <Route path="reports" element={<FacultyReports />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><DashboardLayout role="student" /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="academics" element={<StudentAcademics />} />
                <Route path="materials" element={<StudentMaterials />} />
                <Route path="submissions" element={<StudentSubmissions />} />
                <Route path="violations" element={<StudentViolations />} />
                <Route path="achievements" element={<StudentAchievements />} />
                <Route path="events" element={<StudentEvents />} />
                <Route path="organizations" element={<StudentOrganizations />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
