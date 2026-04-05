<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['subject', 'faculty.user', 'section', 'room']);

        if ($request->has('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->has('day')) {
            $query->where('day', $request->day);
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'faculty_id' => 'required|exists:faculty,id',
            'section_id' => 'required|exists:sections,id',
            'room_id' => 'required|exists:rooms,id',
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'academic_year' => 'required|string',
            'semester' => 'required|integer|min:1|max:2',
        ]);

        // Load related models for validation
        $section = \App\Models\Section::withCount('students')->find($validated['section_id']);
        $room = \App\Models\Room::find($validated['room_id']);
        $subject = \App\Models\Subject::find($validated['subject_id']);

        // 1. ROOM CAPACITY CHECK
        // Count students in section vs room capacity
        $sectionStudentCount = \App\Models\Student::where('section_id', $section->id)->count();
        if ($sectionStudentCount > $room->capacity) {
            return response()->json([
                'message' => 'Room capacity exceeded',
                'error' => "Section has {$sectionStudentCount} students but room '{$room->name}' only has capacity for {$room->capacity} students."
            ], 422);
        }

        // 2. SCHEDULE CONFLICT CHECKS
        $day = $validated['day'];
        $startTime = $validated['start_time'];
        $endTime = $validated['end_time'];
        $academicYear = $validated['academic_year'];
        $semester = $validated['semester'];

        // Helper function to check time overlap
        $hasTimeConflict = function ($query) use ($startTime, $endTime) {
            $query->where(function ($q) use ($startTime, $endTime) {
                // Check if new schedule overlaps with existing
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($inner) use ($startTime, $endTime) {
                      $inner->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                  });
            });
        };

        // 2a. ROOM CONFLICT: Same room at same time
        $roomConflict = Schedule::where('room_id', $validated['room_id'])
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where($hasTimeConflict)
            ->exists();

        if ($roomConflict) {
            return response()->json([
                'message' => 'Room schedule conflict',
                'error' => "Room '{$room->name}' is already booked on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // 2b. FACULTY CONFLICT: Same faculty at same time
        $facultyConflict = Schedule::where('faculty_id', $validated['faculty_id'])
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where($hasTimeConflict)
            ->exists();

        if ($facultyConflict) {
            $faculty = \App\Models\Faculty::with('user')->find($validated['faculty_id']);
            return response()->json([
                'message' => 'Faculty schedule conflict',
                'error' => "Faculty '{$faculty->user->name}' is already scheduled on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // 2c. SECTION CONFLICT: Same section at same time
        $sectionConflict = Schedule::where('section_id', $validated['section_id'])
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where($hasTimeConflict)
            ->exists();

        if ($sectionConflict) {
            return response()->json([
                'message' => 'Section schedule conflict',
                'error' => "Section '{$section->name}' is already scheduled on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        $schedule = Schedule::create($validated);
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room']), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room', 'attendance.student.user']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'faculty_id' => 'sometimes|exists:faculty,id',
            'section_id' => 'sometimes|exists:sections,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'day' => 'sometimes|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'academic_year' => 'sometimes|string',
            'semester' => 'sometimes|integer|min:1|max:2',
        ]);

        // Get values (use existing if not provided)
        $roomId = $validated['room_id'] ?? $schedule->room_id;
        $facultyId = $validated['faculty_id'] ?? $schedule->faculty_id;
        $sectionId = $validated['section_id'] ?? $schedule->section_id;
        $day = $validated['day'] ?? $schedule->day;
        $startTime = $validated['start_time'] ?? $schedule->start_time;
        $endTime = $validated['end_time'] ?? $schedule->end_time;
        $academicYear = $validated['academic_year'] ?? $schedule->academic_year;
        $semester = $validated['semester'] ?? $schedule->semester;

        // Load related models
        $section = \App\Models\Section::find($sectionId);
        $room = \App\Models\Room::find($roomId);

        // 1. ROOM CAPACITY CHECK
        $sectionStudentCount = \App\Models\Student::where('section_id', $sectionId)->count();
        if ($sectionStudentCount > $room->capacity) {
            return response()->json([
                'message' => 'Room capacity exceeded',
                'error' => "Section has {$sectionStudentCount} students but room '{$room->name}' only has capacity for {$room->capacity} students."
            ], 422);
        }

        // 2. CONFLICT CHECKS (exclude current schedule)
        $hasTimeConflict = function ($query) use ($startTime, $endTime) {
            $query->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($inner) use ($startTime, $endTime) {
                      $inner->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                  });
            });
        };

        // Room conflict
        $roomConflict = Schedule::where('room_id', $roomId)
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('id', '!=', $schedule->id)
            ->where($hasTimeConflict)
            ->exists();

        if ($roomConflict) {
            return response()->json([
                'message' => 'Room schedule conflict',
                'error' => "Room '{$room->name}' is already booked on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // Faculty conflict
        $facultyConflict = Schedule::where('faculty_id', $facultyId)
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('id', '!=', $schedule->id)
            ->where($hasTimeConflict)
            ->exists();

        if ($facultyConflict) {
            $faculty = \App\Models\Faculty::with('user')->find($facultyId);
            return response()->json([
                'message' => 'Faculty schedule conflict',
                'error' => "Faculty '{$faculty->user->name}' is already scheduled on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // Section conflict
        $sectionConflict = Schedule::where('section_id', $sectionId)
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('id', '!=', $schedule->id)
            ->where($hasTimeConflict)
            ->exists();

        if ($sectionConflict) {
            return response()->json([
                'message' => 'Section schedule conflict',
                'error' => "Section '{$section->name}' is already scheduled on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        $schedule->update($validated);
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }

    public function mySchedule(Request $request)
    {
        if ($request->user()->isFaculty()) {
            $faculty = $request->user()->faculty;
            
            if (!$faculty) {
                return response()->json([
                    'message' => 'Faculty profile not found. Please contact administrator to set up your faculty profile.'
                ], 404);
            }
            
            $schedules = Schedule::with(['subject', 'section', 'room', 'attendance'])
                ->where('faculty_id', $faculty->id)
                ->get();
        } else {
            $student = $request->user()->student;
            
            if (!$student) {
                return response()->json([
                    'message' => 'Student profile not found. Please contact administrator to set up your student profile.'
                ], 404);
            }
            
            $sectionIds = Section::where('name', $student->section)
                ->where('course_id', $student->course_id)
                ->pluck('id');
            
            $schedules = Schedule::with(['subject', 'faculty.user', 'room'])
                ->whereIn('section_id', $sectionIds)
                ->get();
        }

        return response()->json($schedules);
    }
}
