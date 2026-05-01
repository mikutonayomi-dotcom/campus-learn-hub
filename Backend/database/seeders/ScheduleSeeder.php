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
            ->orderBy('year_level')
            ->orderBy('name')
            ->get();

        // Get all rooms
        $rooms = Room::get();

        // Get all subjects from course_subjects (1st semester)
        $courseSubjects = CourseSubject::where('semester', 1)
            ->with('subject')
            ->get();

        if ($sections->isEmpty() || $rooms->isEmpty() || $courseSubjects->isEmpty()) {
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

                // Assign room based on subject type
                $assignedRoom = $this->assignRoom($subject, $rooms, $roomSchedule);
                
                if (!$assignedRoom) {
                    $this->command->warn('No available room for subject: ' . $subject->name);
                    continue;
                }

                // Find available time slot (avoid conflicts)
                $scheduleInfo = $this->findAvailableTimeSlot(
                    $section,
                    $assignedRoom,
                    $days,
                    $timeSlots,
                    $roomSchedule,
                    $sectionSchedule
                );

                if (!$scheduleInfo) {
                    $this->command->warn('No available time slot for ' . $subject->name . ' in section ' . $section->name);
                    continue;
                }

                // Assign faculty based on subject specialization
                $assignedFaculty = $this->assignFaculty($subject);
                
                // Create schedule
                Schedule::create([
                    'subject_id' => $subject->id,
                    'section_id' => $section->id,
                    'room_id' => $assignedRoom->id,
                    'faculty_id' => $assignedFaculty ? $assignedFaculty->id : null,
                    'day' => $scheduleInfo['day'],
                    'start_time' => $scheduleInfo['start_time'],
                    'end_time' => $scheduleInfo['end_time'],
                ]);

                // Update conflict tracking
                $this->updateConflictTracking(
                    $assignedRoom->id,
                    $section->id,
                    $scheduleInfo['day'],
                    $scheduleInfo['time_slot_index'],
                    $roomSchedule,
                    $sectionSchedule
                );

                $scheduleCount++;
            }
        }

        $this->command->info('Schedules seeded successfully!');
        $this->command->info('Total schedules created: ' . $scheduleCount);
    }

    private function assignFaculty($subject)
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

        // Find matching specialization based on subject name
        $matchedSpecializations = [];
        foreach ($subjectSpecializationMap as $keyword => $specializations) {
            if (stripos($subject->name, $keyword) !== false) {
                $matchedSpecializations = $specializations;
                break;
            }
        }

        // Default to Programming if no match
        if (empty($matchedSpecializations)) {
            $matchedSpecializations = ['Programming'];
        }

        // Find faculty with matching specialization
        $faculty = Faculty::whereHas('user', function ($query) {
            $query->where('is_active', true);
        })->where(function ($query) use ($matchedSpecializations) {
            foreach ($matchedSpecializations as $specialization) {
                $query->orWhere('specialization', 'LIKE', "%{$specialization}%");
            }
        })->inRandomOrder()->first();

        return $faculty;
    }

    private function assignRoom($subject, $rooms, &$roomSchedule)
    {
        // Determine room type based on subject
        $isLabSubject = preg_match('/(Programming|Web|Networking|Database|App|Data|Cloud|Software|Capstone)/i', $subject->name) ||
                        preg_match('/(CC|IT)/i', $subject->code);

        $roomType = $isLabSubject ? 'lab' : 'classroom';

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
        $room,
        $days,
        $timeSlots,
        &$roomSchedule,
        &$sectionSchedule
    ) {
        // Try each day
        foreach ($days as $day) {
            // Try each time slot
            foreach ($timeSlots as $index => $startTime) {
                $endTime = date('H:i', strtotime($startTime) + 3600); // +1 hour

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
        $roomId,
        $sectionId,
        $day,
        $timeSlotIndex,
        &$roomSchedule,
        &$sectionSchedule
    ) {
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
