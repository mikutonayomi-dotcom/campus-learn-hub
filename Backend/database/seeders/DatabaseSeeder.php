<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@uc.edu.ph'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Seed initial data (courses, rooms)
        $this->call(InitialDataSeeder::class);

        // Seed BSIT course subjects with CCS curriculum
        $this->call(CourseSubjectsSeeder::class);

        // Seed sections for all year levels
        $this->call(SectionsSeeder::class);

        // Seed faculty (20 users with specializations)
        $this->call(FacultySeeder::class);

        // Seed students (980 users distributed across sections)
        $this->call(StudentSeeder::class);

        // Seed schedules with realistic time distribution and conflict validation
        $this->call(ScheduleSeeder::class);

        // Seed skills for student profiling
        $this->call(SkillsSeeder::class);

        // Seed organizations
        $this->call(OrganizationsSeeder::class);

        // Seed sample profile data (skills, achievements, events, memberships)
        $this->call(SampleProfileDataSeeder::class);
    }
}
