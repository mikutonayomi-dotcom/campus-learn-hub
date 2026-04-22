<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Subject;

class CourseSubjectsSeeder extends Seeder
{
    public function run(): void
    {
        // Create or get BSIT course
        $bsit = Course::firstOrCreate(
            ['code' => 'BSIT'],
            [
                'name' => 'Bachelor of Science in Information Technology',
                'description' => 'A four-year degree program that provides students with the knowledge and skills needed to design, develop, and manage information systems.',
                'duration_years' => 4,
                'is_active' => true,
            ]
        );

        // Define all subjects organized by year level and semester
        $subjects = [
            // 1st Year - 1st Semester
            [
                'code' => 'CC 1',
                'title' => 'Computing Fundamentals',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'CC 2',
                'title' => 'Intro to Computer Programming',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'Math 100',
                'title' => 'Mathematics in the Modern World',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'Engl 100',
                'title' => 'Purposive Communication',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'GE 1',
                'title' => 'Understanding the Self',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'NSTP 1',
                'title' => 'National Service Training Program 1',
                'units' => 3,
                'type' => 'Mandated',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'PATHFit 1',
                'title' => 'Movement & Fitness 1',
                'units' => 2,
                'type' => 'PE',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],

            // 1st Year - 2nd Semester
            [
                'code' => 'CC 3',
                'title' => 'Computer Programming 2',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 2',
                'year_level' => 1,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'Hist 100',
                'title' => 'Readings in Philippine History',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 1,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'NSTP 2',
                'title' => 'National Service Training Program 2',
                'units' => 3,
                'type' => 'Mandated',
                'prerequisite' => 'NSTP 1',
                'year_level' => 1,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'PATHFit 2',
                'title' => 'Movement & Fitness 2',
                'units' => 2,
                'type' => 'PE',
                'prerequisite' => 'PATHFit 1',
                'year_level' => 1,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],

            // 2nd Year - 1st Semester
            [
                'code' => 'CC 4',
                'title' => 'Data Structures and Algorithms',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 3',
                'year_level' => 2,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 04',
                'title' => 'Object-Oriented Programming',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 3',
                'year_level' => 2,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 07',
                'title' => 'Networking 1',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 1',
                'year_level' => 2,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'GE 3',
                'title' => 'The Contemporary World',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 2,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'PATHFit 3',
                'title' => 'Sports and Dance 1',
                'units' => 2,
                'type' => 'PE',
                'prerequisite' => 'PATHFit 2',
                'year_level' => 2,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],

            // 2nd Year - 2nd Semester
            [
                'code' => 'CC 5',
                'title' => 'Information Management 1',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 4',
                'year_level' => 2,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 05',
                'title' => 'Discrete Mathematics',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'Math 100',
                'year_level' => 2,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 11',
                'title' => 'Web Systems and Technologies 1',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 3',
                'year_level' => 2,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'GE 8',
                'title' => 'Ethics',
                'units' => 3,
                'type' => 'Gen Ed',
                'prerequisite' => 'None',
                'year_level' => 2,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'PATHFit 4',
                'title' => 'Sports and Dance 2',
                'units' => 2,
                'type' => 'PE',
                'prerequisite' => 'PATHFit 3',
                'year_level' => 2,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],

            // 3rd Year - 1st Semester
            [
                'code' => 'IT 13',
                'title' => 'Advanced Database Systems',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 5',
                'year_level' => 3,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 14',
                'title' => 'Networking 2',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'IT 07',
                'year_level' => 3,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 19',
                'title' => 'Info Assurance and Security 1',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 5',
                'year_level' => 3,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 22',
                'title' => 'Software Engineering',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 4',
                'year_level' => 3,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],

            // 3rd Year - 2nd Semester
            [
                'code' => 'IT 15',
                'title' => 'Systems Integration & Architecture',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'IT 11',
                'year_level' => 3,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 26',
                'title' => 'Capstone Project 1',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'Junior Standing',
                'year_level' => 3,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'CC 6',
                'title' => 'App Dev & Emerging Tech',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'CC 5',
                'year_level' => 3,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 17',
                'title' => 'Social and Professional Issues',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'Junior Standing',
                'year_level' => 3,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],

            // 4th Year - 1st Semester
            [
                'code' => 'IT 27',
                'title' => 'Capstone Project 2',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'IT 26',
                'year_level' => 4,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 24',
                'title' => 'Cloud Computing & Tech',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'IT 14',
                'year_level' => 4,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 25',
                'title' => 'Info Assurance and Security 2',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'IT 19',
                'year_level' => 4,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],
            [
                'code' => 'IT 28',
                'title' => 'Special Topics for IT',
                'units' => 3,
                'type' => 'Major',
                'prerequisite' => 'Senior Standing',
                'year_level' => 4,
                'semester' => '1st',
                'course_id' => $bsit->id,
            ],

            // 4th Year - 2nd Semester
            [
                'code' => 'IT 31',
                'title' => 'Practicum / Internship',
                'units' => 6,
                'type' => 'Major',
                'prerequisite' => 'All Major Subjects',
                'year_level' => 4,
                'semester' => '2nd',
                'course_id' => $bsit->id,
            ],
        ];

        // Insert all subjects using firstOrCreate to avoid duplicates
        foreach ($subjects as $subjectData) {
            Subject::firstOrCreate(
                ['code' => $subjectData['code']],
                $subjectData
            );
        }

        $this->command->info('BSIT course subjects seeded successfully!');
        $this->command->info('Total subjects: ' . count($subjects));
    }
}
