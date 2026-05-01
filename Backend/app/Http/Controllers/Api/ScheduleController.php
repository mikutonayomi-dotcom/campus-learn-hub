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
        $query = Schedule::with(['subject', 'section', 'room']);

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

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'required|exists:sections,id',
            'room_id' => 'required|exists:rooms,id',
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
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
            ->where($hasTimeConflict)
            ->exists();

        if ($roomConflict) {
            return response()->json([
                'message' => 'Room schedule conflict',
                'error' => "Room '{$room->name}' is already booked on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // 2b. SECTION CONFLICT: Same section at same time
        $sectionConflict = Schedule::where('section_id', $validated['section_id'])
            ->where('day', $day)
            ->where($hasTimeConflict)
            ->exists();

        if ($sectionConflict) {
            return response()->json([
                'message' => 'Section schedule conflict',
                'error' => "Section '{$section->name}' is already scheduled on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        $schedule = Schedule::create($validated);
        return response()->json($schedule->load(['subject', 'section', 'room']), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['subject', 'section', 'room', 'attendance.student.user']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'section_id' => 'sometimes|exists:sections,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'day' => 'sometimes|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
        ]);

        // Get values (use existing if not provided)
        $roomId = $validated['room_id'] ?? $schedule->room_id;
        $sectionId = $validated['section_id'] ?? $schedule->section_id;
        $day = $validated['day'] ?? $schedule->day;
        $startTime = $validated['start_time'] ?? $schedule->start_time;
        $endTime = $validated['end_time'] ?? $schedule->end_time;

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
            ->where('id', '!=', $schedule->id)
            ->where($hasTimeConflict)
            ->exists();

        if ($roomConflict) {
            return response()->json([
                'message' => 'Room schedule conflict',
                'error' => "Room '{$room->name}' is already booked on {$day} from {$startTime} to {$endTime}."
            ], 422);
        }

        // Section conflict
        $sectionConflict = Schedule::where('section_id', $sectionId)
            ->where('day', $day)
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
        return response()->json($schedule->load(['subject', 'section', 'room']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }

    public function mySchedule(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isStudent()) {
                $student = $user->student;

                if (!$student) {
                    return response()->json([
                        'message' => 'Student profile not found. Please contact administrator to set up your student profile.'
                    ], 404);
                }

                // Use the new schedules() method that combines curriculum with actual schedules
                $schedules = $student->schedules();
                return response()->json($schedules);
                
            } elseif ($user->isFaculty()) {
                $faculty = $user->faculty;

                if (!$faculty) {
                    return response()->json([
                        'message' => 'Faculty profile not found. Please contact administrator to set up your faculty profile.'
                    ], 404);
                }

                // Get faculty schedules with related data
                $schedules = $faculty->schedules()
                    ->with(['subject', 'section', 'room'])
                    ->get()
                    ->groupBy(function ($schedule) {
                        return $schedule->day;
                    });

                return response()->json($schedules);
            }

            return response()->json([]);
            
        } catch (\Exception $e) {
            \Log::error('mySchedule error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch schedule'], 500);
        }
    }

    public function generateSchedule(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);

        $section = Section::with('course')->find($validated['section_id']);

        // Get curriculum subjects for this section's course, year level
        $courseSubjects = CourseSubject::where('course_id', $section->course_id)
            ->where('year_level', $section->year_level)
            ->where('semester', $section->semester)
            ->with('subject')
            ->get();

        if ($courseSubjects->isEmpty()) {
            return response()->json([
                'message' => 'No curriculum subjects found for this section',
                'error' => "No subjects defined for {$section->course->name} Year {$section->year_level} Semester {$section->semester}"
            ], 404);
        }

        // Get available rooms
        $rooms = Room::get();

        // Time slots (7:00 AM to 7:00 PM, 1-hour slots)
        $timeSlots = [
            '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        $generatedSchedules = [];
        $roomUsage = []; // Track room usage

        foreach ($courseSubjects as $courseSubject) {
            $subject = $courseSubject->subject;
            $sessionsPerWeek = 2; // Default to 2 sessions per week

            // Determine subject type for room assignment
            $subjectType = $this->determineSubjectType($subject->code, $subject->name);

            // Assign room based on subject type
            $assignedRoom = $this->assignRoom($rooms, $subjectType);

            if (!$assignedRoom) {
                return response()->json([
                    'message' => 'No available room for subject',
                    'error' => "No {$subjectType} room available for {$subject->name}"
                ], 422);
            }

            // Distribute sessions across the week
            $assignedDays = $this->distributeSessions($days, $sessionsPerWeek, $section->id);

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
                    $section->id
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
                    'section_id' => $section->id,
                    'room_id' => $assignedRoom->id,
                    'day' => $day,
                    'start_time' => $timeSlot,
                    'end_time' => date('H:i', strtotime($timeSlot) + 3600), // 1 hour duration
                ]);

                $generatedSchedules[] = $schedule->load(['subject', 'section', 'room']);

                // Update workload tracking
                $roomUsage[$assignedRoom->id][$day] = ($roomUsage[$assignedRoom->id][$day] ?? 0) + 1;
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
                return 'lab';
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

    private function distributeSessions($days, $sessionsNeeded, $sectionId)
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
                ->exists();

            if (!$hasConflict) {
                $assignedDays[] = $day;
            }
        }

        return $assignedDays;
    }

    private function findAvailableTimeSlot($timeSlots, $day, $roomId, $sectionId)
    {
        foreach ($timeSlots as $timeSlot) {
            $endTime = date('H:i', strtotime($timeSlot) + 3600);

            // Check room availability
            $roomConflict = Schedule::where('room_id', $roomId)
                ->where('day', $day)
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $timeSlot)
                ->exists();

            if ($roomConflict) {
                continue;
            }

            // Check section availability
            $sectionConflict = Schedule::where('section_id', $sectionId)
                ->where('day', $day)
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
