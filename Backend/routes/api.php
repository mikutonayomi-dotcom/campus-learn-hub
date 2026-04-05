<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Profile routes
    Route::get('/my-profile', [StudentController::class, 'myProfile']);
    Route::get('/faculty/my-profile', [FacultyController::class, 'myProfile']);

    // Course routes
    Route::apiResource('courses', CourseController::class);

    // Room routes
    Route::apiResource('rooms', RoomController::class);
    Route::get('/rooms/{room}/availability', [RoomController::class, 'availability']);

    // Student routes
    Route::get('/students/next-id', [StudentController::class, 'getNextStudentId']);
    Route::apiResource('students', StudentController::class);
    Route::get('/faculty/my-students', [FacultyController::class, 'myStudents']);

    // Faculty routes
    Route::get('/faculty/next-id', [FacultyController::class, 'getNextEmployeeId']);
    Route::apiResource('faculty', FacultyController::class);

    // Subject routes
    Route::apiResource('subjects', SubjectController::class);

    // Section routes
    Route::apiResource('sections', SectionController::class);
    Route::get('/sections/{section}/students', [SectionController::class, 'students']);

    // Schedule routes
    Route::apiResource('schedules', ScheduleController::class);
    Route::get('/my-schedule', [ScheduleController::class, 'mySchedule']);

    // Violation routes
    Route::apiResource('violations', ViolationController::class);
    Route::post('/violations/{violation}/approve', [ViolationController::class, 'approve']);
    Route::post('/violations/{violation}/reject', [ViolationController::class, 'reject']);
    Route::get('/violations/pending/count', [ViolationController::class, 'pendingCount']);

    // Achievement routes
    Route::apiResource('achievements', AchievementController::class);
    Route::post('/achievements/{achievement}/approve', [AchievementController::class, 'approve']);
    Route::post('/achievements/{achievement}/reject', [AchievementController::class, 'reject']);
    Route::get('/achievements/pending/count', [AchievementController::class, 'pendingCount']);

    // Material routes
    Route::apiResource('materials', MaterialController::class);
    Route::get('/my-materials', [MaterialController::class, 'myMaterials']);

    // Submission routes
    Route::apiResource('submissions', SubmissionController::class);
    Route::post('/submissions/{submission}/grade', [SubmissionController::class, 'grade']);
    Route::get('/my-submissions', [SubmissionController::class, 'mySubmissions']);
    Route::get('/submissions-to-grade', [SubmissionController::class, 'submissionsToGrade']);

    // Event routes
    Route::apiResource('events', EventController::class);
    Route::post('/events/{event}/submit-for-approval', [EventController::class, 'submitForApproval']);
    Route::post('/events/{event}/approve', [EventController::class, 'approve']);
    Route::post('/events/{event}/reject', [EventController::class, 'reject']);
    Route::post('/events/{event}/join', [EventController::class, 'join']);
    Route::post('/events/{event}/mark-attendance', [EventController::class, 'markAttendance']);
    Route::get('/events/pending/count', [EventController::class, 'pendingCount']);
    Route::get('/events/upcoming/list', [EventController::class, 'upcomingEvents']);

    // Organization routes
    Route::apiResource('organizations', OrganizationController::class);
    Route::post('/organizations/{organization}/add-member', [OrganizationController::class, 'addMember']);
    Route::post('/organizations/{organization}/remove-member', [OrganizationController::class, 'removeMember']);
    Route::get('/my-organizations', [OrganizationController::class, 'myOrganizations']);

    // Grade routes
    Route::apiResource('grades', GradeController::class);
    Route::post('/grades/{grade}/lock', [GradeController::class, 'lock']);
    Route::get('/my-grades', [GradeController::class, 'myGrades']);
    Route::get('/grades-to-manage', [GradeController::class, 'gradesToManage']);

    // Attendance routes
    Route::apiResource('attendance', AttendanceController::class);
    Route::post('/attendance/bulk', [AttendanceController::class, 'bulkStore']);
    Route::get('/my-attendance', [AttendanceController::class, 'myAttendance']);
    Route::get('/section-attendance', [AttendanceController::class, 'sectionAttendance']);

    // Skill routes
    Route::apiResource('skills', SkillController::class);
    Route::post('/skills/add-to-student', [SkillController::class, 'addToStudent']);
    Route::post('/skills/remove-from-student', [SkillController::class, 'removeFromStudent']);
    Route::post('/skills/verify-student-skill', [SkillController::class, 'verifyStudentSkill']);
    Route::get('/my-skills', [SkillController::class, 'mySkills']);

    // Search routes
    Route::get('/search/students', [SearchController::class, 'searchStudents']);
    Route::get('/search/filter-options', [SearchController::class, 'getFilterOptions']);

    // Report routes
    Route::get('/reports/student-performance', [ReportController::class, 'studentPerformance']);
    Route::get('/reports/attendance', [ReportController::class, 'attendanceReport']);
    Route::get('/reports/violation-summary', [ReportController::class, 'violationSummary']);
    Route::get('/reports/achievement-summary', [ReportController::class, 'achievementSummary']);
    Route::get('/reports/event-participation', [ReportController::class, 'eventParticipation']);
    Route::get('/reports/organizations', [ReportController::class, 'organizationReport']);
    Route::get('/reports/dashboard-stats', [ReportController::class, 'dashboardStats']);

    // Activity log routes
    Route::apiResource('activity-logs', ActivityLogController::class)->only(['index', 'store']);
    Route::get('/my-logs', [ActivityLogController::class, 'myLogs']);
    Route::get('/activity-logs/students', [ActivityLogController::class, 'studentLogs']);
    Route::get('/activity-logs/faculty', [ActivityLogController::class, 'facultyLogs']);

    // Notification routes
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread/count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/broadcast', [NotificationController::class, 'broadcast']);
});

Route::middleware('auth:sanctum')->get('/test', function (Request $request) {
    return $request->user();
});
