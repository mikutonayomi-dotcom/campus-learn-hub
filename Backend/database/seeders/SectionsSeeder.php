<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Section;
use App\Models\Subject;

class SectionsSeeder extends Seeder
{
    public function run(): void
    {
        // Get BSIT course
        $bsit = Course::where('code', 'BSIT')->first();

        if (!$bsit) {
            $this->command->warn('BSIT course not found. Please run CourseSubjectsSeeder first.');
            return;
        }

        // Define sections configuration
        // 1st-3rd year: Sections A-E (5 sections per semester)
        // 4th year: Sections A-D (4 sections per semester)
        $sectionsConfig = [
            // 1st Year - 5 sections per semester
            ['year_level' => 1, 'semester' => '1st', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            ['year_level' => 1, 'semester' => '2nd', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            // 2nd Year - 5 sections per semester
            ['year_level' => 2, 'semester' => '1st', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            ['year_level' => 2, 'semester' => '2nd', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            // 3rd Year - 5 sections per semester
            ['year_level' => 3, 'semester' => '1st', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            ['year_level' => 3, 'semester' => '2nd', 'sections' => ['A', 'B', 'C', 'D', 'E']],
            // 4th Year - 4 sections per semester
            ['year_level' => 4, 'semester' => '1st', 'sections' => ['A', 'B', 'C', 'D']],
            ['year_level' => 4, 'semester' => '2nd', 'sections' => ['A', 'B', 'C', 'D']],
        ];

        $currentYear = date('Y');
        $academicYear = $currentYear . '-' . ($currentYear + 1);
        $totalSections = 0;

        foreach ($sectionsConfig as $config) {
            $yearLevel = $config['year_level'];
            $semester = $config['semester'];
            $sectionLetters = $config['sections'];

            // Get subjects for this year level and semester
            $subjectsForYearSem = Subject::where('year_level', $yearLevel)
                ->where('semester', $semester)
                ->get();

            foreach ($sectionLetters as $letter) {
                $sectionName = $yearLevel . $letter;

                $section = Section::firstOrCreate(
                    [
                        'name' => $sectionName,
                        'course_id' => $bsit->id,
                        'year_level' => $yearLevel,
                        'semester' => $semester,
                    ],
                    [
                        'academic_year' => $academicYear,
                        'capacity' => 40,
                        'students_count' => 0,
                        'is_active' => true,
                    ]
                );

                // Assign subjects to this section if not already assigned
                if ($subjectsForYearSem->isNotEmpty()) {
                    $existingSubjectIds = $section->subjects()->pluck('subjects.id')->toArray();
                    $newSubjectIds = $subjectsForYearSem->pluck('id')->diff($existingSubjectIds)->toArray();
                    
                    if (!empty($newSubjectIds)) {
                        $section->subjects()->attach($newSubjectIds);
                    }
                }

                $totalSections++;
            }
        }

        $this->command->info('Sections seeded successfully!');
        $this->command->info('Total sections created: ' . $totalSections);
    }
}
