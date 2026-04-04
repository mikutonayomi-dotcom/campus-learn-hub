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

class ReportController extends Controller
{
    public function studentPerformance(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'year_level' => 'nullable|integer',
            'academic_year' => 'nullable|string',
            'semester' => 'nullable|integer',
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
            $gradesQuery = Grade::where('student_id', $student->id);
            
            if ($request->has('academic_year')) {
                $gradesQuery->where('academic_year', $request->academic_year);
            }
            if ($request->has('semester')) {
                $gradesQuery->where('semester', $request->semester);
            }

            $grades = $gradesQuery->get();
            $avgGrade = $grades->avg('total_grade');

            return [
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'course' => $student->course->name,
                'section' => $student->section,
                'year_level' => $student->year_level,
                'status' => $student->status,
                'average_grade' => $avgGrade ? round($avgGrade, 2) : null,
                'subjects_count' => $grades->count(),
                'passing_subjects' => $grades->where('total_grade', '<=', 3.0)->count(),
                'failing_subjects' => $grades->where('total_grade', '>', 3.0)->count(),
            ];
        });

        return response()->json($report);
    }

    public function attendanceReport(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'section' => 'nullable|string',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $query = Student::with('user');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section')) {
            $query->where('section', $request->section);
        }

        $students = $query->get();

        $report = $students->map(function ($student) use ($request) {
            $attendance = Attendance::where('student_id', $student->id)
                ->whereBetween('date', [$request->date_from, $request->date_to])
                ->get();

            $total = $attendance->count();
            $present = $attendance->where('status', 'present')->count();
            $absent = $attendance->where('status', 'absent')->count();
            $late = $attendance->where('status', 'late')->count();
            $excused = $attendance->where('status', 'excused')->count();

            return [
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'section' => $student->section,
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
            $query->whereBetween('achievement_date', [$request->date_from, $request->date_to]);
        }

        $achievements = $query->get();

        $byType = $achievements->groupBy('type')->map->count();
        $byStatus = $achievements->groupBy('status')->map->count();

        $topStudents = $achievements->groupBy('student_id')
            ->map(function ($items) {
                return [
                    'student' => $items->first()->student->user->name,
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
        $organizations = Organization::with(['adviser.user', 'members'])
            ->withCount(['members'])
            ->get();

        $report = $organizations->map(function ($org) {
            return [
                'name' => $org->name,
                'category' => $org->category,
                'adviser' => $org->adviser->user->name,
                'member_count' => $org->members_count,
                'officers' => $org->members->where('pivot.role', '!=', 'member')->count(),
                'is_active' => $org->is_active,
            ];
        });

        return response()->json($report);
    }

    public function dashboardStats()
    {
        $stats = [
            'students' => [
                'total' => Student::count(),
                'by_status' => Student::groupBy('status')->select('status', DB::raw('count(*) as count'))->get(),
                'by_course' => Student::with('course')->get()->groupBy('course.name')->map->count(),
            ],
            'faculty' => [
                'total' => \App\Models\Faculty::where('is_active', true)->count(),
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
                'upcoming' => Event::where('start_date', '>=', now())->where('status', 'approved')->count(),
            ],
            'organizations' => [
                'total' => Organization::where('is_active', true)->count(),
            ],
        ];

        return response()->json($stats);
    }
}
