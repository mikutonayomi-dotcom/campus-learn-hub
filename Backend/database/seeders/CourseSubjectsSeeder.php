<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Subject;
use App\Models\CourseSubject;

class CourseSubjectsSeeder extends Seeder
{
    public function run(): void
    {
        $bsit = Course::firstOrCreate(
            ['code' => 'BSIT'],
            [
                'name' => 'Bachelor of Science in Information Technology',
                'description' => 'A four-year degree program that provides students with the knowledge and skills needed to design, develop, and manage information systems.',
                'duration_years' => 4,
                'is_active' => true,
            ]
        );

        $subjects = [
            ['code' => 'CC 1', 'name' => 'Computing Fundamentals', 'units' => 3, 'description' => 'Computing Fundamentals', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 2', 'name' => 'Intro to Computer Programming', 'units' => 3, 'description' => 'Intro to Computer Programming', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'Math 100', 'name' => 'Mathematics in the Modern World', 'units' => 3, 'description' => 'Mathematics in the Modern World', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'GE 1', 'name' => 'Understanding the Self', 'units' => 3, 'description' => 'Understanding the Self', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'Engl 100', 'name' => 'Purposive Communication', 'units' => 3, 'description' => 'Purposive Communication', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'NSTP 1', 'name' => 'National Service Training Program 1', 'units' => 3, 'description' => 'National Service Training Program 1', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 1', 'name' => 'Movement Enhancement', 'units' => 2, 'description' => 'Movement Enhancement', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 3', 'name' => 'Computer Programming 2', 'units' => 3, 'description' => 'Computer Programming 2', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 05', 'name' => 'Discrete Mathematics', 'units' => 3, 'description' => 'Discrete Mathematics', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'Hist 100', 'name' => 'Readings in Philippine History', 'units' => 3, 'description' => 'Readings in Philippine History', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 2', 'name' => 'Ethics', 'units' => 3, 'description' => 'Ethics', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 3', 'name' => 'The Contemporary World', 'units' => 3, 'description' => 'The Contemporary World', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'NSTP 2', 'name' => 'National Service Training Program 2', 'units' => 3, 'description' => 'National Service Training Program 2', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 2', 'name' => 'Fitness Training', 'units' => 2, 'description' => 'Fitness Training', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'CC 4', 'name' => 'Data Structures and Algorithms', 'units' => 3, 'description' => 'Data Structures and Algorithms', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 04', 'name' => 'Object-Oriented Programming', 'units' => 3, 'description' => 'Object-Oriented Programming', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 07', 'name' => 'Networking 1', 'units' => 3, 'description' => 'Networking 1', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 11', 'name' => 'Web Systems and Technologies 1', 'units' => 3, 'description' => 'Web Systems and Technologies 1', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'GE 4', 'name' => 'Art Appreciation', 'units' => 3, 'description' => 'Art Appreciation', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 3', 'name' => 'Physical Activities in Sports/Dance', 'units' => 2, 'description' => 'Physical Activities in Sports/Dance', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 5', 'name' => 'Information Management 1 (Database)', 'units' => 3, 'description' => 'Information Management 1 (Database)', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 14', 'name' => 'Networking 2', 'units' => 3, 'description' => 'Networking 2', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 15', 'name' => 'Systems Integration and Architecture', 'units' => 3, 'description' => 'Systems Integration and Architecture', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 5', 'name' => 'Science, Technology, and Society', 'units' => 3, 'description' => 'Science, Technology, and Society', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 6', 'name' => 'Life and Works of Rizal', 'units' => 3, 'description' => 'Life and Works of Rizal', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 4', 'name' => 'Physical Activities in Sports/Dance 2', 'units' => 2, 'description' => 'Physical Activities in Sports/Dance 2', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 13', 'name' => 'Advanced Database Systems', 'units' => 3, 'description' => 'Advanced Database Systems', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 19', 'name' => 'Info Assurance and Security 1', 'units' => 3, 'description' => 'Info Assurance and Security 1', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 22', 'name' => 'Software Engineering', 'units' => 3, 'description' => 'Software Engineering', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 6', 'name' => 'App Dev and Emerging Tech', 'units' => 3, 'description' => 'App Dev and Emerging Tech', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 17', 'name' => 'Social and Professional Issues', 'units' => 3, 'description' => 'Social and Professional Issues', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 26', 'name' => 'Capstone Project 1', 'units' => 3, 'description' => 'Capstone Project 1', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 24', 'name' => 'Cloud Computing and Tech', 'units' => 3, 'description' => 'Cloud Computing and Tech', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 25', 'name' => 'Info Assurance and Security 2', 'units' => 3, 'description' => 'Info Assurance and Security 2', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PELEC 1', 'name' => 'Professional Elective 1', 'units' => 3, 'description' => 'Professional Elective 1', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PELEC 2', 'name' => 'Professional Elective 2', 'units' => 3, 'description' => 'Professional Elective 2', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 27', 'name' => 'Capstone Project 2', 'units' => 3, 'description' => 'Capstone Project 2', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 28', 'name' => 'Special Topics for IT', 'units' => 3, 'description' => 'Special Topics for IT', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PELEC 3', 'name' => 'Professional Elective 3', 'units' => 3, 'description' => 'Professional Elective 3', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PELEC 4', 'name' => 'Professional Elective 4', 'units' => 3, 'description' => 'Professional Elective 4', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 31', 'name' => 'Practicum / Internship', 'units' => 6, 'description' => 'Practicum / Internship', 'year_level' => 4, 'semester' => 2, 'course_id' => $bsit->id],
        ];

        foreach ($subjects as $subjectData) {
            $subject = Subject::updateOrCreate(
                ['code' => $subjectData['code']],
                [
                    'name' => $subjectData['name'],
                    'description' => $subjectData['description'],
                    'units' => $subjectData['units'],
                    'year_level' => $subjectData['year_level'],
                    'semester' => $subjectData['semester'],
                ]
            );
            CourseSubject::updateOrCreate(
                [
                    'course_id' => $bsit->id,
                    'subject_id' => $subject->id,
                ],
                [
                    'year_level' => $subjectData['year_level'],
                    'semester' => $subjectData['semester'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('CCS Curriculum seeded successfully!');
        $this->command->info('Total subjects: ' . count($subjects));
    }
}
