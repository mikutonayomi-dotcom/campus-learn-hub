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
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Create faculty user
        $facultyUser = User::firstOrCreate(
            ['email' => 'faculty@uc.edu.ph'],
            [
                'name' => 'Faculty User',
                'password' => Hash::make('password'),
                'role' => 'faculty',
                'is_active' => true,
            ]
        );

        // Create faculty profile
        \App\Models\Faculty::firstOrCreate(
            ['user_id' => $facultyUser->id],
            [
                'employee_id' => 'EMP-2024-001',
                'department' => 'Computer Science',
                'position' => 'Assistant Professor',
                'specialization' => 'Web Development',
                'contact_number' => '09123456789',
                'office_location' => 'Room 201, CCS Building',
                'is_active' => true,
            ]
        );

        // Create student user
        $studentUser = User::firstOrCreate(
            ['email' => 'student@uc.edu.ph'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_active' => true,
            ]
        );

        // Create student profile
        $courseId = \App\Models\Course::where('code', 'BSIT')->first()?->id ?? 1;
        \App\Models\Student::firstOrCreate(
            ['user_id' => $studentUser->id],
            [
                'student_id' => '2024-00001',
                'course_id' => $courseId,
                'section' => '3A',
                'year_level' => 3,
                'contact_number' => '09987654321',
                'address' => 'Cabuyao, Laguna',
                'emergency_contact_name' => 'Parent Name',
                'emergency_contact_number' => '09112223333',
                'status' => 'regular',
            ]
        );

        // Seed initial data (courses, rooms, skills)
        $this->call([
            InitialDataSeeder::class,
        ]);
    }
}
