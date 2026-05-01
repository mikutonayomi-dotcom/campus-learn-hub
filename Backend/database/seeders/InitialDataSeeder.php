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
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Create courses
        $courses = [
            ['code' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology', 'description' => '4-year IT program', 'years' => 4]
        ];

        foreach ($courses as $course) {
            Course::firstOrCreate(['code' => $course['code']], $course);
        }

        // Create rooms
        $rooms = [
            ['name' => 'Computer Lab 101', 'type' => 'lab', 'capacity' => 40],
            ['name' => 'Computer Lab 102', 'type' => 'lab', 'capacity' => 40],
            ['name' => 'Classroom 201', 'type' => 'classroom', 'capacity' => 50],
            ['name' => 'Classroom 202', 'type' => 'classroom', 'capacity' => 50],
            ['name' => 'Auditorium', 'type' => 'auditorium', 'capacity' => 200],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(['name' => $room['name']], $room);
        }

        
    }
}
