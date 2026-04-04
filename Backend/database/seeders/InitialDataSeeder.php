<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Room;
use App\Models\Skill;
use Illuminate\Support\Facades\Hash;

class InitialDataSeeder extends Seeder
{
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

        // Create courses
        $courses = [
            ['code' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology', 'description' => '4-year IT program', 'duration_years' => 4],
            ['code' => 'BSCS', 'name' => 'Bachelor of Science in Computer Science', 'description' => '4-year CS program', 'duration_years' => 4],
            ['code' => 'BSIS', 'name' => 'Bachelor of Science in Information Systems', 'description' => '4-year IS program', 'duration_years' => 4],
        ];

        foreach ($courses as $course) {
            Course::firstOrCreate(['code' => $course['code']], $course);
        }

        // Create rooms
        $rooms = [
            ['code' => 'CL101', 'name' => 'Computer Lab 101', 'type' => 'laboratory', 'capacity' => 40, 'location' => '1st Floor CCS Building'],
            ['code' => 'CL102', 'name' => 'Computer Lab 102', 'type' => 'laboratory', 'capacity' => 40, 'location' => '1st Floor CCS Building'],
            ['code' => 'CR201', 'name' => 'Classroom 201', 'type' => 'classroom', 'capacity' => 50, 'location' => '2nd Floor CCS Building'],
            ['code' => 'CR202', 'name' => 'Classroom 202', 'type' => 'classroom', 'capacity' => 50, 'location' => '2nd Floor CCS Building'],
            ['code' => 'AUD1', 'name' => 'Auditorium', 'type' => 'auditorium', 'capacity' => 200, 'location' => 'Ground Floor Main Building'],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(['code' => $room['code']], $room);
        }

        // Create skills
        $skills = [
            ['name' => 'Programming', 'category' => 'technical', 'description' => 'General programming skills'],
            ['name' => 'Web Development', 'category' => 'technical', 'description' => 'Frontend and backend web dev'],
            ['name' => 'Database Management', 'category' => 'technical', 'description' => 'SQL and NoSQL databases'],
            ['name' => 'Basketball', 'category' => 'sports', 'description' => 'Basketball skills'],
            ['name' => 'Volleyball', 'category' => 'sports', 'description' => 'Volleyball skills'],
            ['name' => 'Leadership', 'category' => 'leadership', 'description' => 'Leadership and management'],
            ['name' => 'Public Speaking', 'category' => 'communication', 'description' => 'Oral communication skills'],
            ['name' => 'Graphic Design', 'category' => 'arts', 'description' => 'Visual design skills'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill['name']], $skill);
        }
    }
}
