import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

// Dashboard Stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/reports/dashboard-stats");
      return data;
    },
  });
};

// Courses
export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await api.get("/courses");
      return data;
    },
  });
};

export const useCourse = (id: number | null) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: any) => {
      const { data } = await api.post("/courses", course);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, course }: { id: number; course: any }) => {
      const { data } = await api.put(`/courses/${id}`, course);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/courses/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Rooms
export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data } = await api.get("/rooms");
      return data;
    },
  });
};

// Students
export const useStudents = (params?: any) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const { data } = await api.get("/students", { params });
      return data;
    },
  });
};

export const useStudent = (id: number | null) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data } = await api.get("/my-profile");
      return data;
    },
  });
};

export const useFacultyProfile = () => {
  return useQuery({
    queryKey: ["faculty-profile"],
    queryFn: async () => {
      const { data } = await api.get("/faculty/my-profile");
      return data;
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: any) => {
      const { data } = await api.post("/students", student);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, student }: { id: number; student: any }) => {
      const { data } = await api.put(`/students/${id}`, student);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/students/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useNextStudentId = () => {
  return useQuery({
    queryKey: ["next-student-id"],
    queryFn: async () => {
      const { data } = await api.get("/students/next-id");
      return data.next_id;
    },
  });
};

// Faculty
export const useCreateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: any) => {
      const { data } = await api.post("/faculty", faculty);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, faculty }: { id: number; faculty: any }) => {
      const { data } = await api.put(`/faculty/${id}`, faculty);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/faculty/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
    },
  });
};

export const useNextFacultyId = () => {
  return useQuery({
    queryKey: ["next-faculty-id"],
    queryFn: async () => {
      const { data } = await api.get("/faculty/next-id");
      return data.next_id;
    },
  });
};

export const useFaculty = () => {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: async () => {
      const { data } = await api.get("/faculty");
      return data;
    },
  });
};

export const useMyStudents = () => {
  return useQuery({
    queryKey: ["my-students"],
    queryFn: async () => {
      const { data } = await api.get("/faculty/my-students");
      return data;
    },
  });
};

// Subjects
export const useSubjects = (params?: any) => {
  return useQuery({
    queryKey: ["subjects", params],
    queryFn: async () => {
      const { data } = await api.get("/subjects", { params });
      return data;
    },
  });
};

// Sections
export const useSections = (params?: any) => {
  return useQuery({
    queryKey: ["sections", params],
    queryFn: async () => {
      const { data } = await api.get("/sections", { params });
      return data;
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: any) => {
      const { data } = await api.post("/sections", section);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, section }: { id: number; section: any }) => {
      const { data } = await api.put(`/sections/${id}`, section);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/sections/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

// Schedules
export const useSchedules = (params?: any) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: async () => {
      const { data } = await api.get("/schedules", { params });
      return data;
    },
  });
};

export const useMySchedule = () => {
  return useQuery({
    queryKey: ["my-schedule"],
    queryFn: async () => {
      const { data } = await api.get("/my-schedule");
      return data;
    },
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (schedule: any) => {
      const { data } = await api.post("/schedules", schedule);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, schedule }: { id: number; schedule: any }) => {
      const { data } = await api.put(`/schedules/${id}`, schedule);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/schedules/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

// Violations
export const useViolations = (params?: any) => {
  return useQuery({
    queryKey: ["violations", params],
    queryFn: async () => {
      const { data } = await api.get("/violations", { params });
      return data;
    },
  });
};

export const useCreateViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (violation: any) => {
      const { data } = await api.post("/violations", violation);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
  });
};

export const useApproveViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: number; remarks?: string }) => {
      const { data } = await api.post(`/violations/${id}/approve`, { admin_remarks: remarks });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};

export const useRejectViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: number; remarks: string }) => {
      const { data } = await api.post(`/violations/${id}/reject`, { admin_remarks: remarks });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};

// Achievements
export const useAchievements = (params?: any) => {
  return useQuery({
    queryKey: ["achievements", params],
    queryFn: async () => {
      const { data } = await api.get("/achievements", { params });
      return data;
    },
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (achievement: any) => {
      const { data } = await api.post("/achievements", achievement);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
};

export const useApproveAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: number; remarks?: string }) => {
      const { data } = await api.post(`/achievements/${id}/approve`, { admin_remarks: remarks });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};

export const useRejectAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: number; remarks: string }) => {
      const { data } = await api.post(`/achievements/${id}/reject`, { admin_remarks: remarks });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};

// Materials
export const useMaterials = (params?: any) => {
  return useQuery({
    queryKey: ["materials", params],
    queryFn: async () => {
      const { data } = await api.get("/materials", { params });
      return data;
    },
  });
};

export const useMyMaterials = () => {
  return useQuery({
    queryKey: ["my-materials"],
    queryFn: async () => {
      const { data } = await api.get("/my-materials");
      return data;
    },
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: any) => {
      const { data } = await api.post("/materials", material);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["my-materials"] });
    },
  });
};

// Submissions
export const useSubmissions = (params?: any) => {
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: async () => {
      const { data } = await api.get("/submissions", { params });
      return data;
    },
  });
};

export const useMySubmissions = () => {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const { data } = await api.get("/my-submissions");
      return data;
    },
  });
};

export const useSubmissionsToGrade = () => {
  return useQuery({
    queryKey: ["submissions-to-grade"],
    queryFn: async () => {
      const { data } = await api.get("/submissions-to-grade");
      return data;
    },
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submission: any) => {
      const { data } = await api.post("/submissions", submission);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions-to-grade"] });
    },
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, grade, feedback }: { id: number; grade: number; feedback?: string }) => {
      const { data } = await api.post(`/submissions/${id}/grade`, { grade, feedback });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions-to-grade"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
};

// Events
export const useEvents = (params?: any) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await api.get("/events", { params });
      return data;
    },
  });
};

export const useUpcomingEvents = () => {
  return useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data } = await api.get("/events/upcoming/list");
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: any) => {
      const { data } = await api.post("/events", event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useJoinEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/events/${id}/join`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Organizations
export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await api.get("/organizations");
      return data;
    },
  });
};

export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ["my-organizations"],
    queryFn: async () => {
      const { data } = await api.get("/my-organizations");
      return data;
    },
  });
};

// Grades
export const useGrades = (params?: any) => {
  return useQuery({
    queryKey: ["grades", params],
    queryFn: async () => {
      const { data } = await api.get("/grades", { params });
      return data;
    },
  });
};

export const useMyGrades = () => {
  return useQuery({
    queryKey: ["my-grades"],
    queryFn: async () => {
      const { data } = await api.get("/my-grades");
      return data;
    },
  });
};

export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (grade: any) => {
      const { data } = await api.post("/grades", grade);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["my-grades"] });
    },
  });
};

// Attendance
export const useAttendance = (params?: any) => {
  return useQuery({
    queryKey: ["attendance", params],
    queryFn: async () => {
      const { data } = await api.get("/attendance", { params });
      return data;
    },
  });
};

export const useMyAttendance = () => {
  return useQuery({
    queryKey: ["my-attendance"],
    queryFn: async () => {
      const { data } = await api.get("/my-attendance");
      return data;
    },
  });
};

export const useBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attendance: any) => {
      const { data } = await api.post("/attendance/bulk", attendance);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
    },
  });
};

// Skills
export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await api.get("/skills");
      return data;
    },
  });
};

export const useMySkills = () => {
  return useQuery({
    queryKey: ["my-skills"],
    queryFn: async () => {
      const { data } = await api.get("/my-skills");
      return data;
    },
  });
};

// Search
export const useSearchStudents = (params?: any) => {
  return useQuery({
    queryKey: ["search-students", params],
    queryFn: async () => {
      const { data } = await api.get("/search/students", { params });
      return data;
    },
    enabled: !!params?.search || !!params?.course_id || !!params?.skill_ids,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: async () => {
      const { data } = await api.get("/search/filter-options");
      return data;
    },
  });
};

// Reports
export const useStudentPerformanceReport = (params?: any) => {
  return useQuery({
    queryKey: ["student-performance-report", params],
    queryFn: async () => {
      const { data } = await api.get("/reports/student-performance", { params });
      return data;
    },
  });
};

export const useAttendanceReport = (params?: any) => {
  return useQuery({
    queryKey: ["attendance-report", params],
    queryFn: async () => {
      const { data } = await api.get("/reports/attendance", { params });
      return data;
    },
  });
};

export const useViolationSummary = (params?: any) => {
  return useQuery({
    queryKey: ["violation-summary", params],
    queryFn: async () => {
      const { data } = await api.get("/reports/violation-summary", { params });
      return data;
    },
  });
};

export const useAchievementSummary = (params?: any) => {
  return useQuery({
    queryKey: ["achievement-summary", params],
    queryFn: async () => {
      const { data } = await api.get("/reports/achievement-summary", { params });
      return data;
    },
  });
};

// Activity Logs
export const useActivityLogs = (params?: any) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: async () => {
      const { data } = await api.get("/activity-logs", { params });
      return data;
    },
  });
};

export const useStudentLogs = () => {
  return useQuery({
    queryKey: ["student-logs"],
    queryFn: async () => {
      const { data } = await api.get("/activity-logs/students");
      return data;
    },
  });
};

export const useFacultyLogs = () => {
  return useQuery({
    queryKey: ["faculty-logs"],
    queryFn: async () => {
      const { data } = await api.get("/activity-logs/faculty");
      return data;
    },
  });
};

// Notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const { data } = await api.get("/notifications/unread/count");
      return data.count;
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/notifications/${id}/mark-as-read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
};

// Approvals (pending counts)
export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      const [violations, achievements, events] = await Promise.all([
        api.get("/violations/pending/count"),
        api.get("/achievements/pending/count"),
        api.get("/events/pending/count"),
      ]);
      return {
        violations: violations.data.count,
        achievements: achievements.data.count,
        events: events.data.count,
        total: violations.data.count + achievements.data.count + events.data.count,
      };
    },
  });
};
