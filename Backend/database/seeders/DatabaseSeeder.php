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
        User::firstOrCreate(
            ['email' => 'faculty@uc.edu.ph'],
            [
                'name' => 'Faculty User',
                'password' => Hash::make('password'),
                'role' => 'faculty',
                'is_active' => true,
            ]
        );

        // Create student user
        User::firstOrCreate(
            ['email' => 'student@uc.edu.ph'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_active' => true,
            ]
        );

        // Seed initial data (courses, rooms, skills)
        $this->call([
            InitialDataSeeder::class,
        ]);
    }
}
