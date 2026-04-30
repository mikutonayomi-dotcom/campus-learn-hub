<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Populate course_subjects with BSIT curriculum
        // Year 1, 1st Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 1, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Computing Fundamentals
            ['course_id' => 1, 'subject_id' => 2, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Intro to Computer Programming
            ['course_id' => 1, 'subject_id' => 3, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Mathematics in the Modern World
            ['course_id' => 1, 'subject_id' => 4, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Purposive Communication
            ['course_id' => 1, 'subject_id' => 5, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Understanding the Self
            ['course_id' => 1, 'subject_id' => 6, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // NSTP 1
            ['course_id' => 1, 'subject_id' => 7, 'year_level' => 1, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // PATHFit 1
        ]);

        // Year 1, 2nd Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 8, 'year_level' => 1, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Computer Programming 2
            ['course_id' => 1, 'subject_id' => 9, 'year_level' => 1, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Readings in Philippine History
            ['course_id' => 1, 'subject_id' => 10, 'year_level' => 1, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // NSTP 2
            ['course_id' => 1, 'subject_id' => 11, 'year_level' => 1, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // PATHFit 2
        ]);

        // Year 2, 1st Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 12, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Data Structures and Algorithms
            ['course_id' => 1, 'subject_id' => 13, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Object-Oriented Programming
            ['course_id' => 1, 'subject_id' => 14, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Networking 1
            ['course_id' => 1, 'subject_id' => 15, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // The Contemporary World
            ['course_id' => 1, 'subject_id' => 16, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Sports and Dance 1
            ['course_id' => 1, 'subject_id' => 17, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Information Management 1
            ['course_id' => 1, 'subject_id' => 18, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Discrete Mathematics
            ['course_id' => 1, 'subject_id' => 19, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Web Systems and Technologies 1
            ['course_id' => 1, 'subject_id' => 20, 'year_level' => 2, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Ethics
        ]);

        // Year 2, 2nd Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 21, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Sports and Dance 2
            ['course_id' => 1, 'subject_id' => 22, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Advanced Database Systems
            ['course_id' => 1, 'subject_id' => 23, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Networking 2
            ['course_id' => 1, 'subject_id' => 24, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Info Assurance and Security 1
            ['course_id' => 1, 'subject_id' => 25, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Software Engineering
            ['course_id' => 1, 'subject_id' => 26, 'year_level' => 2, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Systems Integration & Architecture
        ]);

        // Year 3, 1st Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 27, 'year_level' => 3, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Capstone Project 1
            ['course_id' => 1, 'subject_id' => 28, 'year_level' => 3, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // App Dev & Emerging Tech
            ['course_id' => 1, 'subject_id' => 29, 'year_level' => 3, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Social and Professional Issues
        ]);

        // Year 3, 2nd Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 30, 'year_level' => 3, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Capstone Project 2
            ['course_id' => 1, 'subject_id' => 31, 'year_level' => 3, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Cloud Computing & Tech
            ['course_id' => 1, 'subject_id' => 32, 'year_level' => 3, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Info Assurance and Security 2
            ['course_id' => 1, 'subject_id' => 33, 'year_level' => 3, 'semester' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Special Topics for IT
        ]);

        // Year 4, 1st Semester
        DB::table('course_subjects')->insert([
            ['course_id' => 1, 'subject_id' => 34, 'year_level' => 4, 'semester' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // Practicum / Internship
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('course_subjects')->truncate();
    }
};
