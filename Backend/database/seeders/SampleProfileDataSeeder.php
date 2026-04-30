<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Skill;
use App\Models\Organization;
use App\Models\Achievement;
use App\Models\Event;
use App\Models\EventParticipant;
use App\Models\OrganizationMember;
use App\Models\StudentSkill;
use App\Models\Faculty;

class SampleProfileDataSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::with('user')->take(100)->get();
        $skills = Skill::all();
        $organizations = Organization::all();
        $faculty = Faculty::all();

        if ($students->isEmpty()) {
            $this->command->warn('No students found. Please run StudentSeeder first.');
            return;
        }

        if ($skills->isEmpty()) {
            $this->command->warn('No skills found. Please run SkillsSeeder first.');
            return;
        }

        if ($organizations->isEmpty()) {
            $this->command->warn('No organizations found. Please run OrganizationsSeeder first.');
            return;
        }

        // Assign skills to students (2-4 skills per student)
        $skillAssignments = 0;
        $skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        
        foreach ($students as $student) {
            $numSkills = rand(2, 4);
            $studentSkills = $skills->random($numSkills);
            
            foreach ($studentSkills as $skill) {
                StudentSkill::firstOrCreate(
                    [
                        'student_id' => $student->id,
                        'skill_id' => $skill->id,
                    ],
                    [
                        'level' => $skillLevels[array_rand($skillLevels)],
                        'is_verified' => rand(0, 1) ? true : false,
                    ]
                );
                $skillAssignments++;
            }
        }
        $this->command->info('Skills assigned to students: ' . $skillAssignments);

        // Assign students to organizations (30% of students in organizations)
        $orgMemberships = 0;
        foreach ($students as $student) {
            if (rand(1, 10) <= 3) { // 30% chance
                $org = $organizations->random();
                $role = rand(1, 10) <= 8 ? 'Member' : 'Officer';
                
                OrganizationMember::firstOrCreate(
                    [
                        'student_id' => $student->id,
                        'organization_id' => $org->id,
                    ],
                    [
                        'role' => $role,
                        'joined_at' => now()->subMonths(rand(1, 12)),
                    ]
                );
                $orgMemberships++;
            }
        }
        $this->command->info('Organization memberships created: ' . $orgMemberships);

        // Create sample achievements (20% of students have achievements)
        $achievementsCreated = 0;
        $achievementTypes = ['academic', 'non_academic', 'sports', 'leadership', 'other'];
        $achievementTitles = [
            'Dean\'s Lister',
            'Champion - Programming Contest',
            'Best in Research',
            'Outstanding Student Leader',
            'Most Valuable Player',
            'Best in Web Development',
            'Excellence in Cybersecurity',
            'Community Service Award',
        ];

        foreach ($students as $student) {
            if (rand(1, 10) <= 2) { // 20% chance
                $recorder = $faculty->random();
                
                Achievement::create([
                    'student_id' => $student->id,
                    'recorded_by' => $recorder->id,
                    'title' => $achievementTitles[array_rand($achievementTitles)],
                    'type' => $achievementTypes[array_rand($achievementTypes)],
                    'description' => 'Outstanding performance in ' . $achievementTitles[array_rand($achievementTitles)],
                    'achievement_date' => now()->subMonths(rand(1, 24)),
                    'organization' => $organizations->random()->name,
                    'status' => 'approved',
                    'approved_by' => 1, // Admin
                    'approved_at' => now()->subMonths(rand(1, 23)),
                ]);
                $achievementsCreated++;
            }
        }
        $this->command->info('Achievements created: ' . $achievementsCreated);

        // Create sample events
        $events = [
            [
                'title' => 'Programming Competition 2026',
                'description' => 'Annual programming competition for CCS students',
                'type' => 'academic',
                'start_date' => now()->addMonths(2),
                'end_date' => now()->addMonths(2)->addHours(8),
                'venue' => 'Main Auditorium',
                'status' => 'approved',
            ],
            [
                'title' => 'CCS Sports Fest',
                'description' => 'Sports festival for CCS students',
                'type' => 'sports',
                'start_date' => now()->addMonths(1),
                'end_date' => now()->addMonths(1)->addDays(3),
                'venue' => 'University Gym',
                'status' => 'approved',
            ],
            [
                'title' => 'Tech Summit 2026',
                'description' => 'Technology summit featuring industry speakers',
                'type' => 'academic',
                'start_date' => now()->addMonths(3),
                'end_date' => now()->addMonths(3)->addHours(6),
                'venue' => 'Main Auditorium',
                'status' => 'approved',
            ],
        ];

        foreach ($events as $eventData) {
            $organizer = $faculty->random();
            Event::firstOrCreate(
                ['title' => $eventData['title']],
                [
                    'description' => $eventData['description'],
                    'type' => $eventData['type'],
                    'start_date' => $eventData['start_date'],
                    'end_date' => $eventData['end_date'],
                    'venue' => $eventData['venue'],
                    'organized_by' => $organizer->id,
                    'organizer_type' => 'faculty',
                    'status' => $eventData['status'],
                ]
            );
        }
        $this->command->info('Events created: ' . count($events));

        // Register students for events (40% of students participate in events)
        $events = Event::all();
        $eventParticipations = 0;
        
        foreach ($students as $student) {
            if (rand(1, 10) <= 4) { // 40% chance
                $event = $events->random();
                
                EventParticipant::firstOrCreate(
                    [
                        'student_id' => $student->id,
                        'event_id' => $event->id,
                    ],
                    [
                        'status' => 'registered',
                    ]
                );
                $eventParticipations++;
            }
        }
        $this->command->info('Event participations created: ' . $eventParticipations);

        $this->command->info('Sample profile data seeded successfully!');
    }
}
