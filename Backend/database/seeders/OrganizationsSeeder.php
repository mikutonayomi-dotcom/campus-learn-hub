<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Faculty;

class OrganizationsSeeder extends Seeder
{
    public function run(): void
    {
        // Get faculty to assign as advisers
        $faculty = Faculty::with('user')->get();
        
        if ($faculty->isEmpty()) {
            $this->command->warn('No faculty found. Please run FacultySeeder first.');
            return;
        }

        $organizations = [
            [
                'name' => 'CCS Student Council',
                'description' => 'The official student government of the College of Computer Studies',
                'category' => 'Student Government',
                'adviser_index' => 0,
            ],
            [
                'name' => 'Programming Club',
                'description' => 'A club for students passionate about programming and software development',
                'category' => 'Academic',
                'adviser_index' => 1,
            ],
            [
                'name' => 'Web Developers Society',
                'description' => 'Organization focused on web development technologies and practices',
                'category' => 'Academic',
                'adviser_index' => 2,
            ],
            [
                'name' => 'Cybersecurity Society',
                'description' => 'Organization dedicated to cybersecurity awareness and skills development',
                'category' => 'Academic',
                'adviser_index' => 3,
            ],
            [
                'name' => 'CCS Basketball Team',
                'description' => 'Official basketball team of the College of Computer Studies',
                'category' => 'Sports',
                'adviser_index' => 4,
            ],
            [
                'name' => 'CCS Volleyball Team',
                'description' => 'Official volleyball team of the College of Computer Studies',
                'category' => 'Sports',
                'adviser_index' => 5,
            ],
            [
                'name' => 'Esports Society',
                'description' => 'Organization for competitive gaming and esports enthusiasts',
                'category' => 'Sports',
                'adviser_index' => 6,
            ],
            [
                'name' => 'CCS Choir',
                'description' => 'Choral group for students who love singing and music',
                'category' => 'Arts',
                'adviser_index' => 7,
            ],
            [
                'name' => 'Dance Troupe',
                'description' => 'Dance organization for various dance styles and performances',
                'category' => 'Arts',
                'adviser_index' => 8,
            ],
            [
                'name' => 'Research Society',
                'description' => 'Organization focused on academic research and publication',
                'category' => 'Academic',
                'adviser_index' => 9,
            ],
        ];

        $count = 0;
        foreach ($organizations as $orgData) {
            $adviser = $faculty[$orgData['adviser_index'] % $faculty->count()];
            
            Organization::firstOrCreate(
                ['name' => $orgData['name']],
                [
                    'description' => $orgData['description'],
                    'adviser_id' => $adviser->id,
                    'category' => $orgData['category'],
                    'is_active' => true,
                ]
            );
            $count++;
        }

        $this->command->info('Organizations seeded successfully!');
        $this->command->info('Total organizations created: ' . $count);
    }
}
