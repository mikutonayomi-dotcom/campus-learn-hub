<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillsSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // 💻 TECHNICAL
            ['name' => 'Programming', 'category' => 'technical', 'description' => 'General programming skills'],
            ['name' => 'Java', 'category' => 'technical', 'description' => 'Java programming language'],
            ['name' => 'Python', 'category' => 'technical', 'description' => 'Python programming language'],
            ['name' => 'JavaScript', 'category' => 'technical', 'description' => 'JavaScript programming language'],
            ['name' => 'PHP', 'category' => 'technical', 'description' => 'PHP programming language'],
            ['name' => 'C++', 'category' => 'technical', 'description' => 'C++ programming language'],
            ['name' => 'Web Development', 'category' => 'technical', 'description' => 'Web application development'],
            ['name' => 'Mobile Development', 'category' => 'technical', 'description' => 'Mobile application development'],
            ['name' => 'Database Management', 'category' => 'technical', 'description' => 'Database design and management'],
            ['name' => 'SQL', 'category' => 'technical', 'description' => 'Structured Query Language'],
            ['name' => 'API Development', 'category' => 'technical', 'description' => 'API design and development'],
            ['name' => 'Software Engineering', 'category' => 'technical', 'description' => 'Software engineering principles'],
            ['name' => 'System Analysis', 'category' => 'technical', 'description' => 'System analysis and design'],
            
            // 🌐 NETWORK / INFRA
            ['name' => 'Networking', 'category' => 'technical', 'description' => 'Computer networking'],
            ['name' => 'Cybersecurity', 'category' => 'technical', 'description' => 'Cybersecurity and information security'],
            ['name' => 'Cloud Computing', 'category' => 'technical', 'description' => 'Cloud computing services'],
            ['name' => 'Server Management', 'category' => 'technical', 'description' => 'Server administration and management'],
            
            // 🎨 MULTIMEDIA / ARTS
            ['name' => 'Graphic Design', 'category' => 'arts', 'description' => 'Graphic design and visual arts'],
            ['name' => 'UI/UX Design', 'category' => 'arts', 'description' => 'User interface and experience design'],
            ['name' => 'Video Editing', 'category' => 'arts', 'description' => 'Video editing and production'],
            ['name' => 'Animation', 'category' => 'arts', 'description' => 'Animation and motion graphics'],
            
            // 📊 DATA
            ['name' => 'Data Analysis', 'category' => 'technical', 'description' => 'Data analysis and visualization'],
            ['name' => 'Machine Learning', 'category' => 'technical', 'description' => 'Machine learning and AI'],
            ['name' => 'AI', 'category' => 'technical', 'description' => 'Artificial Intelligence'],
            
            // 🏫 ACADEMIC / SOFT SKILLS
            ['name' => 'Research Writing', 'category' => 'communication', 'description' => 'Research and academic writing'],
            ['name' => 'Public Speaking', 'category' => 'communication', 'description' => 'Public speaking and presentation'],
            ['name' => 'Communication', 'category' => 'communication', 'description' => 'Communication skills'],
            ['name' => 'Leadership', 'category' => 'leadership', 'description' => 'Leadership and management'],
            ['name' => 'Problem Solving', 'category' => 'leadership', 'description' => 'Problem solving and critical thinking'],
            ['name' => 'Teamwork', 'category' => 'leadership', 'description' => 'Team collaboration and teamwork'],
            
            // 🏀 NON-ACADEMIC (SPORTS)
            ['name' => 'Basketball', 'category' => 'sports', 'description' => 'Basketball sports'],
            ['name' => 'Volleyball', 'category' => 'sports', 'description' => 'Volleyball sports'],
            ['name' => 'Badminton', 'category' => 'sports', 'description' => 'Badminton sports'],
            ['name' => 'Chess', 'category' => 'sports', 'description' => 'Chess game'],
            ['name' => 'Esports', 'category' => 'sports', 'description' => 'Electronic sports and gaming'],
            ['name' => 'Dancing', 'category' => 'arts', 'description' => 'Dance and performance'],
            ['name' => 'Singing', 'category' => 'arts', 'description' => 'Singing and music'],
        ];

        $count = 0;
        foreach ($skills as $skillData) {
            Skill::firstOrCreate(
                ['name' => $skillData['name']],
                [
                    'category' => $skillData['category'],
                    'description' => $skillData['description'],
                ]
            );
            $count++;
        }

        $this->command->info('Skills seeded successfully!');
        $this->command->info('Total skills created: ' . $count);
    }
}
