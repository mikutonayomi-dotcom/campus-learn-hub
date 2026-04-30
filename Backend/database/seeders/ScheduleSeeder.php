<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Faculty;
use App\Models\Room;
use App\Models\CourseSubject;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Get all 1st semester sections
        $sections = Section::where('semester', '1st')
            ->where('is_active', true)
            ->orderBy('year_level')
            ->orderBy('name')
            ->get();

        // Get all faculty
        $faculty = Faculty::with('user')->where('is_active', true)->get();

        // Get all rooms
        $rooms = Room::where('is_active', true)->get();

        // Get all subjects from course_subjects (1st semester)
        $courseSubjects = CourseSubject::where('semester', 1)
            ->where('is_active', true)
            ->with('subject')
            ->get();

        if ($sections->isEmpty() || $faculty->isEmpty() || $rooms->isEmpty() || $courseSubjects->isEmpty()) {
            $this->command->warn('Missing required data. Please run other seeders first.');
            return;
        }

        // Time slots: 7:00 AM to 9:00 PM (1-hour slots)
        $timeSlots = [
            '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
            '19:00', '20:00'
        ];

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Track conflicts
        $facultySchedule = []; // faculty_id => [day => [time_slots]]
        $roomSchedule = []; // room_id => [day => [time_slots]]
        $sectionSchedule = []; // section_id => [day => [time_slots]]

        $scheduleCount = 0;
        $currentYear = date('Y');
        $academicYear = $currentYear . '-' . ($currentYear + 1);

        foreach ($sections as $section) {
            // Get subjects for this section's year level (1st semester)
            $sectionSubjects = $courseSubjects->filter(function ($cs) use ($section) {
                return $cs->year_level == $section->year_level;
            });

            if ($sectionSubjects->isEmpty()) {
                $this->command->warn('No subjects found for section ' . $section->name);
                continue;
            }

            foreach ($sectionSubjects as $courseSubject) {
                $subject = $courseSubject->subject;
                
                // Skip if schedule already exists for this subject-section combination
                $existingSchedule = Schedule::where('subject_id', $subject->id)
                    ->where('section_id', $section->id)
                    ->first();
                
                if ($existingSchedule) {
                    continue;
                }

                // Assign faculty based on subject type/specialization
                $assignedFaculty = $this->assignFaculty($subject, $faculty, $facultySchedule);
                
                if (!$assignedFaculty) {
                    $this->command->warn('No available faculty for subject: ' . $subject->name);
                    continue;
                }

                // Assign room based on subject type
                $assignedRoom = $this->assignRoom($subject, $rooms, $roomSchedule);
                
                if (!$assignedRoom) {
                    $this->command->warn('No available room for subject: ' . $subject->name);
                    continue;
                }

                // Find available time slot (avoid conflicts)
                $scheduleInfo = $this->findAvailableTimeSlot(
                    $section,
                    $assignedFaculty,
                    $assignedRoom,
                    $days,
                    $timeSlots,
                    $facultySchedule,
                    $roomSchedule,
                    $sectionSchedule
                );

                if (!$scheduleInfo) {
                    $this->command->warn('No available time slot for ' . $subject->name . ' in section ' . $section->name);
                    continue;
                }

                // Create schedule
                Schedule::create([
                    'subject_id' => $subject->id,
                    'faculty_id' => $assignedFaculty->id,
                    'section_id' => $section->id,
                    'room_id' => $assignedRoom->id,
                    'day' => $scheduleInfo['day'],
                    'start_time' => $scheduleInfo['start_time'],
                    'end_time' => $scheduleInfo['end_time'],
                    'academic_year' => $academicYear,
                    'semester' => 1,
                ]);

                // Update conflict tracking
                $this->updateConflictTracking(
                    $assignedFaculty->id,
                    $assignedRoom->id,
                    $section->id,
                    $scheduleInfo['day'],
                    $scheduleInfo['time_slot_index'],
                    $facultySchedule,
                    $roomSchedule,
                    $sectionSchedule
                );

                $scheduleCount++;
            }
        }

        $this->command->info('Schedules seeded successfully!');
        $this->command->info('Total schedules created: ' . $scheduleCount);
    }

    private function assignFaculty($subject, $faculty, &$facultySchedule)
    {
        // Map subjects to specializations
        $subjectSpecializationMap = [
            'Programming' => ['Programming', 'Software Engineering', 'Mobile Development'],
            'Web' => ['Web Development', 'UI/UX Design'],
            'Networking' => ['Networking', 'Information Security', 'Cybersecurity'],
            'Database' => ['Database', 'Data Science'],
            'Security' => ['Cybersecurity', 'Information Security'],
            'Software' => ['Software Engineering', 'DevOps'],
            'App' => ['Mobile Development', 'Software Engineering'],
            'Data' => ['AI / Data Science', 'Machine Learning'],
            'Cloud' => ['Cloud Computing', 'DevOps'],
            'Math' => ['Programming', 'AI / Data Science'],
            'GE' => ['Programming', 'Web Development'],
            'NSTP' => ['Programming', 'Software Engineering'],
            'PATHFit' => ['Multimedia', 'Game Development'],
            'Capstone' => ['Software Engineering', 'IT Project Management'],
            'Practicum' => ['IT Project Management', 'Software Engineering'],
        ];

        // Find matching specialization
        $matchedSpecializations = [];
        foreach ($subjectSpecializationMap as $keyword => $specializations) {
            if (stripos($subject->name, $keyword) !== false || stripos($subject->code, $keyword) !== false) {
                $matchedSpecializations = array_merge($matchedSpecializations, $specializations);
            }
        }

        // If no match, use all specializations
        if (empty($matchedSpecializations)) {
            $matchedSpecializations = $faculty->pluck('specialization')->unique()->toArray();
        }

        // Find faculty with matching specialization and available schedule
        $availableFaculty = $faculty->filter(function ($f) use ($matchedSpecializations) {
            return in_array($f->specialization, $matchedSpecializations);
        });

        if ($availableFaculty->isEmpty()) {
            // If no match, return any faculty
            $availableFaculty = $faculty;
        }

        // Sort by current schedule count (load balancing)
        $availableFaculty = $availableFaculty->sortBy(function ($f) use ($facultySchedule) {
            $count = isset($facultySchedule[$f->id]) ? array_sum(array_map('count', $facultySchedule[$f->id])) : 0;
            return $count;
        });

        return $availableFaculty->first();
    }

    private function assignRoom($subject, $rooms, &$roomSchedule)
    {
        // Determine room type based on subject
        $isLabSubject = preg_match('/(Programming|Web|Networking|Database|App|Data|Cloud|Software|Capstone)/i', $subject->name) ||
                        preg_match('/(CC|IT)/i', $subject->code);

        $roomType = $isLabSubject ? 'laboratory' : 'classroom';

        // Filter rooms by type
        $availableRooms = $rooms->where('type', $roomType);

        if ($availableRooms->isEmpty()) {
            // Fallback to any room
            $availableRooms = $rooms;
        }

        // Sort by current schedule count (load balancing)
        $availableRooms = $availableRooms->sortBy(function ($r) use ($roomSchedule) {
            $count = isset($roomSchedule[$r->id]) ? array_sum(array_map('count', $roomSchedule[$r->id])) : 0;
            return $count;
        });

        return $availableRooms->first();
    }

    private function findAvailableTimeSlot(
        $section,
        $faculty,
        $room,
        $days,
        $timeSlots,
        &$facultySchedule,
        &$roomSchedule,
        &$sectionSchedule
    ) {
        // Try each day
        foreach ($days as $day) {
            // Try each time slot
            foreach ($timeSlots as $index => $startTime) {
                $endTime = date('H:i', strtotime($startTime) + 3600); // +1 hour

                // Check faculty availability (no overlapping schedules)
                if (isset($facultySchedule[$faculty->id][$day]) && in_array($index, $facultySchedule[$faculty->id][$day])) {
                    continue;
                }

                // Check room availability (no overlapping schedules)
                if (isset($roomSchedule[$room->id][$day]) && in_array($index, $roomSchedule[$room->id][$day])) {
                    continue;
                }

                // Check section availability (no overlapping schedules)
                if (isset($sectionSchedule[$section->id][$day]) && in_array($index, $sectionSchedule[$section->id][$day])) {
                    continue;
                }

                // Slot is available
                return [
                    'day' => $day,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'time_slot_index' => $index,
                ];
            }
        }

        return null;
    }

    private function updateConflictTracking(
        $facultyId,
        $roomId,
        $sectionId,
        $day,
        $timeSlotIndex,
        &$facultySchedule,
        &$roomSchedule,
        &$sectionSchedule
    ) {
        if (!isset($facultySchedule[$facultyId])) {
            $facultySchedule[$facultyId] = [];
        }
        if (!isset($facultySchedule[$facultyId][$day])) {
            $facultySchedule[$facultyId][$day] = [];
        }
        $facultySchedule[$facultyId][$day][] = $timeSlotIndex;

        if (!isset($roomSchedule[$roomId])) {
            $roomSchedule[$roomId] = [];
        }
        if (!isset($roomSchedule[$roomId][$day])) {
            $roomSchedule[$roomId][$day] = [];
        }
        $roomSchedule[$roomId][$day][] = $timeSlotIndex;

        if (!isset($sectionSchedule[$sectionId])) {
            $sectionSchedule[$sectionId] = [];
        }
        if (!isset($sectionSchedule[$sectionId][$day])) {
            $sectionSchedule[$sectionId][$day] = [];
        }
        $sectionSchedule[$sectionId][$day][] = $timeSlotIndex;
    }
}
