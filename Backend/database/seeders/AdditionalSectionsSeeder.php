<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Section;

class AdditionalSectionsSeeder extends Seeder
{
    public function run(): void
    {
        // Get BSIT course
        $bsit = Course::where('code', 'BSIT')->first();

        if (!$bsit) {
            $this->command->warn('BSIT course not found.');
            return;
        }

        // Create additional sections for 2nd, 3rd, and 4th years (1st semester)
        // Need 220 more students, so create 6 more sections (40 capacity each)
        $additionalSections = [
            // 2nd Year - 2 more sections
            ['year_level' => 2, 'semester' => '1st', 'sections' => ['F', 'G']],
            // 3rd Year - 2 more sections
            ['year_level' => 3, 'semester' => '1st', 'sections' => ['F', 'G']],
            // 4th Year - 2 more sections
            ['year_level' => 4, 'semester' => '1st', 'sections' => ['F', 'G']],
        ];

        $currentYear = date('Y');
        $academicYear = $currentYear . '-' . ($currentYear + 1);
        $totalSections = 0;

        foreach ($additionalSections as $config) {
            $yearLevel = $config['year_level'];
            $semester = $config['semester'];
            $sectionLetters = $config['sections'];

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
                        'is_active' => true,
                    ]
                );

                $totalSections++;
            }
        }

        $this->command->info('Additional sections seeded successfully!');
        $this->command->info('Total additional sections created: ' . $totalSections);
    }
}
