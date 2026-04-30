<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student.user', 'schedule.subject', 'marker.user']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('schedule_id')) {
            $query->where('schedule_id', $request->schedule_id);
        }

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('marked_by')) {
            $query->where('marked_by', $request->marked_by);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        // Check if attendance already exists
        $existing = Attendance::where('student_id', $validated['student_id'])
            ->where('schedule_id', $validated['schedule_id'])
            ->where('date', $validated['date'])
            ->first();

        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json(['message' => 'Faculty profile not found'], 404);
        }

        if ($existing) {
            $existing->update([
                ...$validated,
                'marked_by' => $faculty->id,
            ]);
            return response()->json($existing->load(['student.user', 'schedule.subject']), 200);
        }

        $attendance = Attendance::create([
            ...$validated,
            'marked_by' => $faculty->id,
        ]);

        return response()->json($attendance->load(['student.user', 'schedule.subject']), 201);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'attendance.*.remarks' => 'nullable|string',
        ]);

        $created = [];
        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json(['message' => 'Faculty profile not found'], 404);
        }
        
        foreach ($validated['attendance'] as $record) {
            $attendance = Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'schedule_id' => $validated['schedule_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $record['status'],
                    'remarks' => $record['remarks'] ?? null,
                    'marked_by' => $faculty->id,
                ]
            );
            $created[] = $attendance;
        }

        return response()->json(['message' => 'Attendance recorded successfully', 'count' => count($created)]);
    }

    public function show(Attendance $attendance)
    {
        return response()->json($attendance->load(['student.user', 'schedule.subject', 'marker.user']));
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json(['message' => 'Faculty profile not found'], 404);
        }

        $attendance->update([
            ...$validated,
            'marked_by' => $faculty->id,
        ]);

        return response()->json($attendance->load(['student.user', 'schedule.subject']));
    }

    public function myAttendance(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json([
                'records' => [],
                'statistics' => [
                    'total' => 0,
                    'present' => 0,
                    'absent' => 0,
                    'late' => 0,
                    'excused' => 0,
                    'attendance_rate' => 0,
                ],
            ]);
        }

        $attendance = Attendance::with(['schedule.subject'])
            ->where('student_id', $student->id)
            ->orderBy('date', 'desc')
            ->get();

        // Calculate statistics
        $total = $attendance->count();
        $present = $attendance->where('status', 'present')->count();
        $absent = $attendance->where('status', 'absent')->count();
        $late = $attendance->where('status', 'late')->count();
        $excused = $attendance->where('status', 'excused')->count();

        return response()->json([
            'records' => $attendance,
            'statistics' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'attendance_rate' => $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0,
            ],
        ]);
    }

    public function sectionAttendance(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
        ]);

        $schedule = \App\Models\Schedule::with('section')->findOrFail($request->schedule_id);
        
        $students = \App\Models\Student::with(['user', 'attendance' => function ($q) use ($request) {
            $q->where('schedule_id', $request->schedule_id)
              ->where('date', $request->date);
        }])
            ->where('section_id', $schedule->section->id)
            ->get();

        return response()->json([
            'schedule' => $schedule,
            'date' => $request->date,
            'students' => $students,
        ]);
    }
}
