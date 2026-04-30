<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== DATA VALIDATION ===\n\n";

// Check user counts
$totalUsers = App\Models\User::count();
$students = App\Models\Student::count();
$faculty = App\Models\Faculty::count();
$admin = App\Models\User::where('role', 'admin')->count();

echo "User Counts:\n";
echo "Total Users: $totalUsers\n";
echo "Admin: $admin\n";
echo "Faculty: $faculty\n";
echo "Students: $students\n";
echo "Expected: 1000 users (20 faculty + 980 students + admin)\n";
echo "Difference: " . ($totalUsers - 1000) . "\n\n";

// Check section distribution
$sections = App\Models\Section::where('semester', '1st')->orderBy('year_level')->get();
echo "Section Distribution (1st Semester):\n";
$yearTotals = [];
foreach ($sections as $section) {
    $studentCount = App\Models\Student::where('section_id', $section->id)->count();
    echo $section->name . " (Year " . $section->year_level . "): " . $studentCount . " students\n";
    
    if (!isset($yearTotals[$section->year_level])) {
        $yearTotals[$section->year_level] = 0;
    }
    $yearTotals[$section->year_level] += $studentCount;
}

echo "\nTotal by Year Level:\n";
foreach ($yearTotals as $year => $count) {
    echo "Year $year: $count students\n";
}

// Check schedule conflicts
echo "\n=== SCHEDULE VALIDATION ===\n";
$schedules = App\Models\Schedule::with(['faculty', 'room', 'section'])->get();
echo "Total Schedules: " . $schedules->count() . "\n";

// Check faculty conflicts
$facultyConflicts = 0;
foreach ($schedules as $schedule) {
    $conflicts = App\Models\Schedule::where('faculty_id', $schedule->faculty_id)
        ->where('day', $schedule->day)
        ->where('id', '!=', $schedule->id)
        ->where(function($q) use ($schedule) {
            $q->whereBetween('start_time', [$schedule->start_time, $schedule->end_time])
              ->orWhereBetween('end_time', [$schedule->start_time, $schedule->end_time]);
        })
        ->count();
    if ($conflicts > 0) {
        $facultyConflicts++;
    }
}
echo "Faculty Conflicts: $facultyConflicts\n";

// Check room conflicts
$roomConflicts = 0;
foreach ($schedules as $schedule) {
    $conflicts = App\Models\Schedule::where('room_id', $schedule->room_id)
        ->where('day', $schedule->day)
        ->where('id', '!=', $schedule->id)
        ->where(function($q) use ($schedule) {
            $q->whereBetween('start_time', [$schedule->start_time, $schedule->end_time])
              ->orWhereBetween('end_time', [$schedule->start_time, $schedule->end_time]);
        })
        ->count();
    if ($conflicts > 0) {
        $roomConflicts++;
    }
}
echo "Room Conflicts: $roomConflicts\n";

// Check section conflicts
$sectionConflicts = 0;
foreach ($schedules as $schedule) {
    $conflicts = App\Models\Schedule::where('section_id', $schedule->section_id)
        ->where('day', $schedule->day)
        ->where('id', '!=', $schedule->id)
        ->where(function($q) use ($schedule) {
            $q->whereBetween('start_time', [$schedule->start_time, $schedule->end_time])
              ->orWhereBetween('end_time', [$schedule->start_time, $schedule->end_time]);
        })
        ->count();
    if ($conflicts > 0) {
        $sectionConflicts++;
    }
}
echo "Section Conflicts: $sectionConflicts\n";

// Check day distribution
echo "\nDay Distribution:\n";
$dayCounts = [];
foreach ($schedules as $schedule) {
    if (!isset($dayCounts[$schedule->day])) {
        $dayCounts[$schedule->day] = 0;
    }
    $dayCounts[$schedule->day]++;
}
foreach ($dayCounts as $day => $count) {
    echo "$day: $count schedules\n";
}

// Check time distribution
echo "\nTime Distribution:\n";
$timeCounts = [];
foreach ($schedules as $schedule) {
    $timeStr = (string)$schedule->start_time;
    if (!isset($timeCounts[$timeStr])) {
        $timeCounts[$timeStr] = 0;
    }
    $timeCounts[$timeStr]++;
}
ksort($timeCounts);
foreach ($timeCounts as $time => $count) {
    echo "$time: $count schedules\n";
}

// Check faculty teaching load
echo "\nFaculty Teaching Load:\n";
$facultyData = App\Models\Faculty::with('schedules')->get();
foreach ($facultyData as $f) {
    $scheduleCount = $f->schedules->count();
    echo $f->user->name . " (" . $f->specialization . "): $scheduleCount schedules\n";
}

echo "\n=== VALIDATION COMPLETE ===\n";
