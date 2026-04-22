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

        // Seed BSIT course subjects
        $this->call(CourseSubjectsSeeder::class);

        // Seed sections for all year levels
        $this->call(SectionsSeeder::class);
    }
}
