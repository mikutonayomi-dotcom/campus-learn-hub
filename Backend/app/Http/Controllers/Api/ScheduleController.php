<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\CourseSubject;
use App\Models\Faculty;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        try {
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

                // Use the new schedules() method that combines curriculum with actual schedules
                $schedules = $student->schedules();
            }

            return response()->json($schedules);
        } catch (\Exception $e) {
            \Log::error('mySchedule error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch schedule'], 500);
        }
    }

    public function generateSchedule(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'semester' => 'required|integer|min:1|max:2',
            'academic_year' => 'required|string',
        ]);

        $section = Section::with('course')->find($validated['section_id']);
        $semester = $validated['semester'];
        $academicYear = $validated['academic_year'];

        // Get curriculum subjects for this section's course, year level, and semester
        $courseSubjects = CourseSubject::where('course_id', $section->course_id)
            ->where('year_level', $section->year_level)
            ->where('semester', $semester)
            ->where('is_active', true)
            ->with('subject')
            ->get();

        if ($courseSubjects->isEmpty()) {
            return response()->json([
                'message' => 'No curriculum subjects found for this section',
                'error' => "No subjects defined for {$section->course->name} Year {$section->year_level} Semester {$semester}"
            ], 404);
        }

        // Get available faculty
        $faculty = Faculty::with('user')->where('is_active', true)->get();

        // Get available rooms
        $rooms = Room::where('is_active', true)->get();

        // Time slots (7:00 AM to 7:00 PM, 1-hour slots)
        $timeSlots = [
            '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        $generatedSchedules = [];
        $facultyWorkload = []; // Track faculty hours per day
        $roomUsage = []; // Track room usage

        foreach ($courseSubjects as $courseSubject) {
            $subject = $courseSubject->subject;
            $sessionsPerWeek = $subject->units >= 3 ? 3 : 2; // 3-unit subjects meet 3x/week, 2-unit meet 2x/week

            // Determine subject type for room assignment
            $subjectType = $this->determineSubjectType($subject->code, $subject->name);

            // Assign faculty based on specialization
            $assignedFaculty = $this->assignFaculty($faculty, $subject, $facultyWorkload);

            if (!$assignedFaculty) {
                return response()->json([
                    'message' => 'No available faculty for subject',
                    'error' => "No faculty available with specialization for {$subject->name}"
                ], 422);
            }

            // Assign room based on subject type
            $assignedRoom = $this->assignRoom($rooms, $subjectType);

            if (!$assignedRoom) {
                return response()->json([
                    'message' => 'No available room for subject',
                    'error' => "No {$subjectType} room available for {$subject->name}"
                ], 422);
            }

            // Distribute sessions across the week
            $assignedDays = $this->distributeSessions($days, $sessionsPerWeek, $section->id, $academicYear, $semester);

            if (count($assignedDays) < $sessionsPerWeek) {
                return response()->json([
                    'message' => 'Unable to schedule all sessions',
                    'error' => "Could not find available time slots for all {$sessionsPerWeek} sessions of {$subject->name}"
                ], 422);
            }

            // Assign time slots for each day
            foreach ($assignedDays as $day) {
                $timeSlot = $this->findAvailableTimeSlot(
                    $timeSlots,
                    $day,
                    $assignedRoom->id,
                    $assignedFaculty->id,
                    $section->id,
                    $academicYear,
                    $semester
                );

                if (!$timeSlot) {
                    return response()->json([
                        'message' => 'No available time slot',
                        'error' => "No available time slot on {$day} for {$subject->name}"
                    ], 422);
                }

                // Create schedule
                $schedule = Schedule::create([
                    'subject_id' => $subject->id,
                    'faculty_id' => $assignedFaculty->id,
                    'section_id' => $section->id,
                    'room_id' => $assignedRoom->id,
                    'day' => $day,
                    'start_time' => $timeSlot,
                    'end_time' => date('H:i', strtotime($timeSlot) + 3600), // 1 hour duration
                    'academic_year' => $academicYear,
                    'semester' => $semester,
                ]);

                $generatedSchedules[] = $schedule->load(['subject', 'faculty.user', 'section', 'room']);

                // Update workload tracking
                $facultyWorkload[$assignedFaculty->id][$day] = ($facultyWorkload[$assignedFaculty->id][$day] ?? 0) + 1;
            }
        }

        return response()->json([
            'message' => 'Schedule generated successfully',
            'schedules' => $generatedSchedules,
            'total' => count($generatedSchedules)
        ], 201);
    }

    private function determineSubjectType($code, $name)
    {
        $programmingSubjects = ['CC', 'IT'];
        $mathSubjects = ['Math'];
        $geSubjects = ['GE', 'Engl', 'Hist', 'NSTP', 'PATHFit', 'PELEC'];

        foreach ($programmingSubjects as $prefix) {
            if (strpos($code, $prefix) === 0) {
                return 'laboratory';
            }
        }

        foreach ($mathSubjects as $prefix) {
            if (strpos($code, $prefix) === 0) {
                return 'classroom';
            }
        }

        foreach ($geSubjects as $prefix) {
            if (strpos($code, $prefix) === 0) {
                return 'classroom';
            }
        }

        // Default to classroom
        return 'classroom';
    }

    private function assignFaculty($faculty, $subject, &$facultyWorkload)
    {
        // Try to find faculty with matching specialization
        $subjectKeywords = $this->extractSubjectKeywords($subject->code, $subject->name);

        foreach ($faculty as $f) {
            // Check if faculty has less than 6 hours per day
            $dailyHours = 0;
            if (isset($facultyWorkload[$f->id])) {
                $dailyHours = max($facultyWorkload[$f->id]);
            }

            if ($dailyHours >= 6) {
                continue; // Skip if already at max daily hours
            }

            // Check specialization match
            if ($f->specialization) {
                foreach ($subjectKeywords as $keyword) {
                    if (stripos($f->specialization, $keyword) !== false) {
                        return $f;
                    }
                }
            }
        }

        // If no specialization match, assign any available faculty
        foreach ($faculty as $f) {
            $dailyHours = 0;
            if (isset($facultyWorkload[$f->id])) {
                $dailyHours = max($facultyWorkload[$f->id]);
            }

            if ($dailyHours < 6) {
                return $f;
            }
        }

        return null;
    }

    private function extractSubjectKeywords($code, $name)
    {
        $keywords = [];

        if (strpos($code, 'CC') !== false || strpos($name, 'Programming') !== false) {
            $keywords[] = 'programming';
        }
        if (strpos($code, 'IT') !== false && strpos($name, 'Networking') !== false) {
            $keywords[] = 'networking';
        }
        if (strpos($name, 'Database') !== false) {
            $keywords[] = 'database';
        }
        if (strpos($name, 'Web') !== false) {
            $keywords[] = 'web';
        }
        if (strpos($name, 'Math') !== false) {
            $keywords[] = 'mathematics';
        }
        if (strpos($name, 'Security') !== false) {
            $keywords[] = 'security';
        }

        return $keywords;
    }

    private function assignRoom($rooms, $subjectType)
    {
        // Filter rooms by type
        $matchingRooms = $rooms->where('type', $subjectType);

        if ($matchingRooms->isEmpty()) {
            // Fallback to any room if no type match
            return $rooms->first();
        }

        return $matchingRooms->first();
    }

    private function distributeSessions($days, $sessionsNeeded, $sectionId, $academicYear, $semester)
    {
        $assignedDays = [];

        // Try to distribute sessions evenly across the week
        foreach ($days as $day) {
            if (count($assignedDays) >= $sessionsNeeded) {
                break;
            }

            // Check if section already has a class on this day
            $hasConflict = Schedule::where('section_id', $sectionId)
                ->where('day', $day)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->exists();

            if (!$hasConflict) {
                $assignedDays[] = $day;
            }
        }

        return $assignedDays;
    }

    private function findAvailableTimeSlot($timeSlots, $day, $roomId, $facultyId, $sectionId, $academicYear, $semester)
    {
        foreach ($timeSlots as $timeSlot) {
            $endTime = date('H:i', strtotime($timeSlot) + 3600);

            // Check room availability
            $roomConflict = Schedule::where('room_id', $roomId)
                ->where('day', $day)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $timeSlot)
                ->exists();

            if ($roomConflict) {
                continue;
            }

            // Check faculty availability
            $facultyConflict = Schedule::where('faculty_id', $facultyId)
                ->where('day', $day)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $timeSlot)
                ->exists();

            if ($facultyConflict) {
                continue;
            }

            // Check section availability
            $sectionConflict = Schedule::where('section_id', $sectionId)
                ->where('day', $day)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $timeSlot)
                ->exists();

            if ($sectionConflict) {
                continue;
            }

            return $timeSlot;
        }

        return null;
    }
}
