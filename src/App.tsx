import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<PlaceholderPage title="User Management" />} />
            <Route path="logs" element={<PlaceholderPage title="Activity Logs" />} />
            <Route path="approvals" element={<PlaceholderPage title="Approvals" />} />
            <Route path="academics" element={<PlaceholderPage title="Courses & Sections" />} />
            <Route path="scheduling" element={<PlaceholderPage title="Scheduling" />} />
            <Route path="facilities" element={<PlaceholderPage title="Facilities" />} />
            <Route path="events" element={<PlaceholderPage title="Events" />} />
            <Route path="search" element={<PlaceholderPage title="Advanced Search" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Faculty Routes */}
          <Route path="/faculty" element={<DashboardLayout role="faculty" />}>
            <Route index element={<FacultyDashboard />} />
            <Route path="students" element={<PlaceholderPage title="My Students" />} />
            <Route path="violations" element={<PlaceholderPage title="Violations" />} />
            <Route path="achievements" element={<PlaceholderPage title="Achievements" />} />
            <Route path="courses" element={<PlaceholderPage title="Courses & Materials" />} />
            <Route path="submissions" element={<PlaceholderPage title="Submissions" />} />
            <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
            <Route path="events" element={<PlaceholderPage title="Events" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
            <Route path="academics" element={<PlaceholderPage title="Academics" />} />
            <Route path="materials" element={<PlaceholderPage title="Learning Materials" />} />
            <Route path="submissions" element={<PlaceholderPage title="Submissions" />} />
            <Route path="violations" element={<PlaceholderPage title="Violations" />} />
            <Route path="achievements" element={<PlaceholderPage title="Achievements" />} />
            <Route path="events" element={<PlaceholderPage title="Events" />} />
            <Route path="organizations" element={<PlaceholderPage title="Organizations" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
