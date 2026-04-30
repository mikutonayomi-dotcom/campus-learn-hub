<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Room;
use App\Models\Section;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\Schedule;
use App\Models\Submission;
use App\Models\Material;
use App\Models\Announcement;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Violation;
use App\Models\Achievement;
use App\Models\Event;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Notification;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\MedicalRecord;
use App\Models\Skill;
use App\Models\StudentSkill;
use App\Models\ActivityLog;
use App\Models\Assignment;

class ClearSeededDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->warn('Clearing seeded data (keeping courses, subjects, and admin user)...');

        // Clear dependent data first (foreign key constraints)
        QuizAttempt::query()->delete();
        Quiz::query()->delete();
        Assignment::query()->delete();
        Submission::query()->delete();
        Material::query()->delete();
        Announcement::query()->delete();
        Grade::query()->delete();
        Attendance::query()->delete();
        Violation::query()->delete();
        Achievement::query()->delete();
        Event::query()->delete();
        OrganizationMember::query()->delete();
        Organization::query()->delete();
        Notification::query()->delete();
        MedicalRecord::query()->delete();
        StudentSkill::query()->delete();
        ActivityLog::query()->delete();
        Schedule::query()->delete();

        // Clear sections
        Section::query()->delete();

        // Clear rooms
        Room::query()->delete();

        // Clear faculty
        Faculty::query()->delete();

        // Clear students
        Student::query()->delete();

        // Clear non-admin users
        User::where('role', '!=', 'admin')->delete();

        // Clear skills (optional - keeping courses/subjects only)
        Skill::query()->delete();

        $this->command->info('Seeded data cleared successfully!');
        $this->command->info('Preserved: Courses, Subjects, Admin User');
    }
}
