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
                'years' => 4,
            ]
        );

        $subjects = [
            ['code' => 'CC 1', 'name' => 'Computing Fundamentals', 'description' => 'Computing Fundamentals', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 2', 'name' => 'Intro to Computer Programming', 'description' => 'Intro to Computer Programming', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'Math 100', 'name' => 'Mathematics in the Modern World', 'description' => 'Mathematics in the Modern World', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'GE 1', 'name' => 'Understanding the Self', 'description' => 'Understanding the Self', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'Engl 100', 'name' => 'Purposive Communication', 'description' => 'Purposive Communication', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'NSTP 1', 'name' => 'National Service Training Program 1', 'description' => 'National Service Training Program 1', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 1', 'name' => 'Movement Enhancement', 'description' => 'Movement Enhancement', 'year_level' => 1, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 3', 'name' => 'Computer Programming 2', 'description' => 'Computer Programming 2', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 05', 'name' => 'Discrete Mathematics', 'description' => 'Discrete Mathematics', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'Hist 100', 'name' => 'Readings in Philippine History', 'description' => 'Readings in Philippine History', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 2', 'name' => 'Ethics', 'description' => 'Ethics', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 3', 'name' => 'The Contemporary World', 'description' => 'The Contemporary World', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'NSTP 2', 'name' => 'National Service Training Program 2', 'description' => 'National Service Training Program 2', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 2', 'name' => 'Fitness Training', 'description' => 'Fitness Training', 'year_level' => 1, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'CC 4', 'name' => 'Data Structures and Algorithms', 'description' => 'Data Structures and Algorithms', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 04', 'name' => 'Object-Oriented Programming', 'description' => 'Object-Oriented Programming', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 07', 'name' => 'Networking 1', 'description' => 'Networking 1', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 11', 'name' => 'Web Systems and Technologies 1', 'description' => 'Web Systems and Technologies 1', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'GE 4', 'name' => 'Art Appreciation', 'description' => 'Art Appreciation', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 3', 'name' => 'Physical Activities in Sports/Dance', 'description' => 'Physical Activities in Sports/Dance', 'year_level' => 2, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 5', 'name' => 'Information Management 1 (Database)', 'description' => 'Information Management 1 (Database)', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 14', 'name' => 'Networking 2', 'description' => 'Networking 2', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 15', 'name' => 'Systems Integration and Architecture', 'description' => 'Systems Integration and Architecture', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 5', 'name' => 'Science, Technology, and Society', 'description' => 'Science, Technology, and Society', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'GE 6', 'name' => 'Life and Works of Rizal', 'description' => 'Life and Works of Rizal', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PATHFit 4', 'name' => 'Physical Activities in Sports/Dance 2', 'description' => 'Physical Activities in Sports/Dance 2', 'year_level' => 2, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 13', 'name' => 'Advanced Database Systems', 'description' => 'Advanced Database Systems', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 19', 'name' => 'Info Assurance and Security 1', 'description' => 'Info Assurance and Security 1', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 22', 'name' => 'Software Engineering', 'description' => 'Software Engineering', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'CC 6', 'name' => 'App Dev and Emerging Tech', 'description' => 'App Dev and Emerging Tech', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 17', 'name' => 'Social and Professional Issues', 'description' => 'Social and Professional Issues', 'year_level' => 3, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 26', 'name' => 'Capstone Project 1', 'description' => 'Capstone Project 1', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 24', 'name' => 'Cloud Computing and Tech', 'description' => 'Cloud Computing and Tech', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 25', 'name' => 'Info Assurance and Security 2', 'description' => 'Info Assurance and Security 2', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PELEC 1', 'name' => 'Professional Elective 1', 'description' => 'Professional Elective 1', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'PELEC 2', 'name' => 'Professional Elective 2', 'description' => 'Professional Elective 2', 'year_level' => 3, 'semester' => 2, 'course_id' => $bsit->id],
            ['code' => 'IT 27', 'name' => 'Capstone Project 2', 'description' => 'Capstone Project 2', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 28', 'name' => 'Special Topics for IT', 'description' => 'Special Topics for IT', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PELEC 3', 'name' => 'Professional Elective 3', 'description' => 'Professional Elective 3', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'PELEC 4', 'name' => 'Professional Elective 4', 'description' => 'Professional Elective 4', 'year_level' => 4, 'semester' => 1, 'course_id' => $bsit->id],
            ['code' => 'IT 31', 'name' => 'Practicum / Internship', 'description' => 'Practicum / Internship', 'year_level' => 4, 'semester' => 2, 'course_id' => $bsit->id],
        ];

        foreach ($subjects as $subjectData) {
            $subject = Subject::updateOrCreate(
                ['code' => $subjectData['code']],
                [
                    'name' => $subjectData['name'],
                    'description' => $subjectData['description'],
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
                ]
            );
        }

        $this->command->info('CCS Curriculum seeded successfully!');
        $this->command->info('Total subjects: ' . count($subjects));
    }
}
