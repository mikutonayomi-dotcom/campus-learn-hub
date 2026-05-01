<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Violation;
use App\Models\Achievement;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function studentPerformance(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'year_level' => 'nullable|integer',
        ]);

        $query = Student::with(['user', 'course']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        $students = $query->get();

        $report = $students->map(function ($student) use ($request) {
            $grades = Grade::where('student_id', $student->id)->get();
            $avgGrade = $grades->avg('overall_grade');

            return [
                'student_id' => $student->student_id,
                'name' => $student->user ? ($student->user->first_name . ' ' . $student->user->last_name) : 'Unknown',
                'course' => $student->course ? $student->course->name : null,
                'section' => $student->section ? $student->section->name : null,
                'year_level' => $student->year_level,
                'average_grade' => $avgGrade ? round($avgGrade, 2) : null,
                'subjects_count' => $grades->count(),
                'passing_subjects' => $grades->where('overall_grade', '<=', 3.0)->count(),
                'failing_subjects' => $grades->where('overall_grade', '>', 3.0)->count(),
            ];
        });

        return response()->json($report);
    }

    public function attendanceReport(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'section' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $query = Student::with('user');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        $students = $query->get();

        $report = $students->map(function ($student) use ($request) {
            $attendanceQuery = Attendance::where('student_id', $student->id);
            
            if ($request->filled('date_from') && $request->filled('date_to')) {
                $attendanceQuery->whereBetween('date', [$request->date_from, $request->date_to]);
            }
            
            $attendance = $attendanceQuery->get();

            $total = $attendance->count();
            $present = $attendance->where('status', 'present')->count();
            $absent = $attendance->where('status', 'absent')->count();
            $late = $attendance->where('status', 'late')->count();
            $excused = $attendance->where('status', 'excused')->count();

            return [
                'student_id' => $student->student_id,
                'name' => $student->user ? ($student->user->first_name . ' ' . $student->user->last_name) : 'Unknown',
                'section' => $student->section ? $student->section->name : null,
                'total_classes' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'attendance_rate' => $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0,
            ];
        });

        return response()->json($report);
    }

    public function violationSummary(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = Violation::with(['student.user']);

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('violation_date', [$request->date_from, $request->date_to]);
        }

        $violations = $query->get();

        $bySeverity = $violations->groupBy('severity')->map->count();
        $byType = $violations->groupBy('type')->map->count();
        $byStatus = $violations->groupBy('status')->map->count();

        return response()->json([
            'total_violations' => $violations->count(),
            'by_severity' => $bySeverity,
            'by_type' => $byType,
            'by_status' => $byStatus,
            'recent_violations' => $violations->take(10),
        ]);
    }

    public function achievementSummary(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = Achievement::with(['student.user']);

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        $achievements = $query->get();

        $byType = $achievements->groupBy('type')->map->count();
        $byStatus = $achievements->groupBy('status')->map->count();

        $topStudents = $achievements->groupBy('student_id')
            ->map(function ($items) {
                return [
                    'student' => $items->first()->student && $items->first()->student->user ? ($items->first()->student->user->first_name . ' ' . $items->first()->student->user->last_name) : 'Unknown',
                    'count' => $items->count(),
                ];
            })
            ->sortByDesc('count')
            ->take(10);

        return response()->json([
            'total_achievements' => $achievements->count(),
            'by_type' => $byType,
            'by_status' => $byStatus,
            'top_students' => $topStudents,
            'recent_achievements' => $achievements->take(10),
        ]);
    }

    public function eventParticipation(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
        ]);

        if ($request->has('event_id')) {
            $event = Event::with(['participants.user'])->findOrFail($request->event_id);
            
            $participants = $event->participants;
            
            return response()->json([
                'event' => $event->title,
                'total_registered' => $participants->count(),
                'attended' => $participants->where('pivot.status', 'attended')->count(),
                'absent' => $participants->where('pivot.status', 'absent')->count(),
                'participants' => $participants,
            ]);
        }

        $events = Event::withCount(['participants'])->get();

        return response()->json($events);
    }

    public function organizationReport(Request $request)
    {
        $organizations = Organization::with(['members'])
            ->withCount(['members'])
            ->get();

        $report = $organizations->map(function ($org) {
            return [
                'name' => $org->name,
                'category' => $org->category,
                'member_count' => $org->members_count,
                'officers' => $org->members ? $org->members->where('pivot.role', '!=', 'member')->count() : 0,
            ];
        });

        return response()->json($report);
    }

    public function dashboardStats()
    {
        try {
            $stats = [
                'students' => [
                    'total' => Student::count(),
                    'by_course' => [],
                ],
                'faculty' => [
                    'total' => \App\Models\Faculty::count(),
                ],
                'violations' => [
                    'total' => Violation::count(),
                    'pending' => Violation::where('status', 'pending')->count(),
                ],
                'achievements' => [
                    'total' => Achievement::count(),
                    'pending' => Achievement::where('status', 'pending')->count(),
                ],
                'events' => [
                    'total' => Event::count(),
                    'upcoming' => Event::where('date', '>=', now())->where('status', 'approved')->count(),
                ],
                'organizations' => [
                    'total' => Organization::count(),
                ],
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard stats', 'message' => $e->getMessage()], 500);
        }
    }

    public function exportStudentPerformance(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'year_level' => 'nullable|integer',
        ]);

        $query = Student::with(['user', 'course']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        $students = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="student_performance_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($students, $request) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Student ID', 'Name', 'Course', 'Section', 'Year Level', 'Average Grade', 'Subjects Count', 'Passing Subjects', 'Failing Subjects']);

            foreach ($students as $student) {
                $grades = Grade::where('student_id', $student->id)->get();
                $avgGrade = $grades->avg('overall_grade');

                fputcsv($file, [
                    $student->student_id,
                    $student->user ? ($student->user->first_name . ' ' . $student->user->last_name) : 'Unknown',
                    $student->course ? $student->course->name : null,
                    $student->section ? $student->section->name : null,
                    $student->year_level,
                    $avgGrade ? round($avgGrade, 2) : 'N/A',
                    $grades->count(),
                    $grades->where('overall_grade', '<=', 3.0)->count(),
                    $grades->where('overall_grade', '>', 3.0)->count(),
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    public function exportAttendanceReport(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'section_id' => 'nullable|exists:sections,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $query = Student::with('user');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        $students = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendance_report_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($students, $request) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Student ID', 'Name', 'Section', 'Total Classes', 'Present', 'Absent', 'Late', 'Excused', 'Attendance Rate (%)']);

            foreach ($students as $student) {
                $attendanceQuery = Attendance::where('student_id', $student->id);
                
                if ($request->filled('date_from') && $request->filled('date_to')) {
                    $attendanceQuery->whereBetween('date', [$request->date_from, $request->date_to]);
                }
                
                $attendance = $attendanceQuery->get();

                $total = $attendance->count();
                $present = $attendance->where('status', 'present')->count();
                $absent = $attendance->where('status', 'absent')->count();
                $late = $attendance->where('status', 'late')->count();
                $excused = $attendance->where('status', 'excused')->count();
                $rate = $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0;

                fputcsv($file, [
                    $student->student_id,
                    $student->user ? ($student->user->first_name . ' ' . $student->user->last_name) : 'Unknown',
                    $student->section ? $student->section->name : null,
                    $total,
                    $present,
                    $absent,
                    $late,
                    $excused,
                    $rate,
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    public function exportViolationSummary(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = Violation::with(['student.user', 'type']);

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('violation_date', [$request->date_from, $request->date_to]);
        }

        $violations = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="violation_summary_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($violations) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Student ID', 'Student Name', 'Violation Type', 'Severity', 'Description', 'Date', 'Status', 'Reported By']);

            foreach ($violations as $violation) {
                fputcsv($file, [
                    $violation->student ? $violation->student->student_id : 'N/A',
                    $violation->student && $violation->student->user ? ($violation->student->user->first_name . ' ' . $violation->student->user->last_name) : 'Unknown',
                    $violation->type ? $violation->type->name : $violation->type,
                    $violation->severity,
                    $violation->description,
                    $violation->date,
                    $violation->status,
                    $violation->faculty ? ($violation->faculty->user->first_name . ' ' . $violation->faculty->user->last_name) : 'N/A',
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    public function exportAchievementSummary(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = Achievement::with(['student.user']);

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('achievement_date', [$request->date_from, $request->date_to]);
        }

        $achievements = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="achievement_summary_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($achievements) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Student ID', 'Student Name', 'Achievement Title', 'Type', 'Description', 'Date', 'Organization', 'Status']);

            foreach ($achievements as $achievement) {
                fputcsv($file, [
                    $achievement->student ? $achievement->student->student_id : 'N/A',
                    $achievement->student && $achievement->student->user ? ($achievement->student->user->first_name . ' ' . $achievement->student->user->last_name) : 'Unknown',
                    $achievement->title,
                    $achievement->type,
                    $achievement->description,
                    $achievement->date,
                    $achievement->organization,
                    $achievement->status,
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    public function exportEventParticipation(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
        ]);

        if ($request->has('event_id')) {
            $event = Event::with(['participants.user'])->findOrFail($request->event_id);
            
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="event_participation_' . $event->title . '_' . date('Y-m-d') . '.csv"',
            ];

            $callback = function () use ($event) {
                $file = fopen('php://output', 'w');
                
                fputcsv($file, ['Student ID', 'Student Name', 'Event', 'Status']);

                foreach ($event->participants as $participant) {
                    fputcsv($file, [
                        $participant->student_id,
                        $participant->user ? ($participant->user->first_name . ' ' . $participant->user->last_name) : 'Unknown',
                        $event->title,
                        $participant->pivot->status ?? 'registered',
                    ]);
                }

                fclose($file);
            };

            return new StreamedResponse($callback, 200, $headers);
        }

        $events = Event::withCount(['participants'])->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="events_overview_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($events) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Event Title', 'Type', 'Start Date', 'End Date', 'Venue', 'Total Registered', 'Status']);

            foreach ($events as $event) {
                fputcsv($file, [
                    $event->title,
                    $event->type,
                    $event->start_date,
                    $event->end_date,
                    $event->venue,
                    $event->participants_count,
                    $event->status,
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    public function exportOrganizationReport(Request $request)
    {
        $organizations = Organization::with(['adviser.user', 'members'])
            ->withCount(['members'])
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="organization_report_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($organizations) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Organization Name', 'Category', 'Adviser', 'Member Count', 'Officers Count', 'Status']);

            foreach ($organizations as $org) {
                fputcsv($file, [
                    $org->name,
                    $org->category,
                    $org->members_count,
                    $org->members ? $org->members->where('pivot.role', '!=', 'member')->count() : 0,
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
