<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ViolationType;

class ViolationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $violationTypes = [
            // 🟢 LOW SEVERITY (Minor)
            [
                'name' => 'Late to Class',
                'severity' => 'low',
                'category' => 'Attendance',
                'description' => 'Arriving late to scheduled classes',
            ],
            [
                'name' => 'Improper Uniform / Dress Code',
                'severity' => 'low',
                'category' => 'Appearance',
                'description' => 'Not following the school dress code policy',
            ],
            [
                'name' => 'Minor Disruption',
                'severity' => 'low',
                'category' => 'Conduct',
                'description' => 'Talking, noise, or other minor disruptions during class',
            ],
            [
                'name' => 'Use of Mobile Phone During Class',
                'severity' => 'low',
                'category' => 'Conduct',
                'description' => 'Using mobile phone without permission during class',
            ],
            [
                'name' => 'Failure to Bring Required Materials',
                'severity' => 'low',
                'category' => 'Preparation',
                'description' => 'Not bringing required books, materials, or equipment',
            ],
            [
                'name' => 'Loitering',
                'severity' => 'low',
                'category' => 'Conduct',
                'description' => 'Loitering in unauthorized areas during class hours',
            ],

            // 🟡 MEDIUM SEVERITY (Moderate)
            [
                'name' => 'Absence Without Valid Reason',
                'severity' => 'medium',
                'category' => 'Attendance',
                'description' => 'Missing class without valid excuse or documentation',
            ],
            [
                'name' => 'Repeated Tardiness',
                'severity' => 'medium',
                'category' => 'Attendance',
                'description' => 'Habitual late arrival to classes',
            ],
            [
                'name' => 'Disrespectful Behavior',
                'severity' => 'medium',
                'category' => 'Conduct',
                'description' => 'Showing disrespect to faculty, staff, or peers',
            ],
            [
                'name' => 'Skipping Classes',
                'severity' => 'medium',
                'category' => 'Attendance',
                'description' => 'Intentionally missing scheduled classes',
            ],
            [
                'name' => 'Minor Property Misuse',
                'severity' => 'medium',
                'category' => 'Property',
                'description' => 'Improper use of school property or equipment',
            ],
            [
                'name' => 'Unauthorized Leaving of Classroom',
                'severity' => 'medium',
                'category' => 'Conduct',
                'description' => 'Leaving classroom without permission during class',
            ],

            // 🔴 HIGH SEVERITY (Major)
            [
                'name' => 'Cheating During Exam',
                'severity' => 'high',
                'category' => 'Academic',
                'description' => 'Using unauthorized materials or methods during examinations',
            ],
            [
                'name' => 'Plagiarism',
                'severity' => 'high',
                'category' => 'Academic',
                'description' => 'Presenting someone else\'s work as one\'s own',
            ],
            [
                'name' => 'Bullying / Harassment',
                'severity' => 'high',
                'category' => 'Conduct',
                'description' => 'Bullying, harassment, or intimidation of others',
            ],
            [
                'name' => 'Vandalism',
                'severity' => 'high',
                'category' => 'Property',
                'description' => 'Intentional damage to school property',
            ],
            [
                'name' => 'Fighting / Physical Altercation',
                'severity' => 'high',
                'category' => 'Conduct',
                'description' => 'Physical fighting or altercation with others',
            ],
            [
                'name' => 'Theft',
                'severity' => 'high',
                'category' => 'Property',
                'description' => 'Stealing or taking property that belongs to others',
            ],
            [
                'name' => 'Possession of Prohibited Items',
                'severity' => 'high',
                'category' => 'Prohibited',
                'description' => 'Possessing weapons, drugs, or other prohibited items',
            ],
            [
                'name' => 'Academic Dishonesty',
                'severity' => 'high',
                'category' => 'Academic',
                'description' => 'Any form of academic dishonesty or fraud',
            ],
        ];

        foreach ($violationTypes as $type) {
            ViolationType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
