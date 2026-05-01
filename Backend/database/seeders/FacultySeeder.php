<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Faculty;
use Illuminate\Support\Facades\Hash;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $specializations = [
            'Programming',
            'Web Development',
            'Networking',
            'Database',
            'Cybersecurity',
            'Software Engineering',
            'Multimedia',
            'AI / Data Science',
            'Mobile Development',
            'Cloud Computing',
            'DevOps',
            'Game Development',
            'UI/UX Design',
            'Systems Analysis',
            'IT Project Management',
            'Information Security',
            'Machine Learning',
            'Blockchain',
            'IoT',
            'Quantum Computing'
        ];

        $positions = [
            'Instructor I',
            'Instructor II',
            'Instructor III',
            'Assistant Professor',
            'Associate Professor',
            'Professor'
        ];

        $employmentStatuses = ['Full-time', 'Part-time'];

        $departments = [
            'College of Computer Studies',
            'College of Engineering',
            'College of Business'
        ];

        $educationalAttainment = [
            'Bachelor of Science in Information Technology',
            'Bachelor of Science in Computer Science',
            'Master of Science in Information Technology',
            'Master of Science in Computer Science',
            'PhD in Computer Science',
            'PhD in Information Technology'
        ];

        $firstNames = [
            'Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Rosa', 'Miguel', 'Carmen',
            'Carlos', 'Elena', 'Antonio', 'Sofia', 'Francisco', 'Laura', 'Luis',
            'Isabella', 'Diego', 'Valentina', 'Javier', 'Camila'
        ];

        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Fernandez', 'Ramos',
            'Mendoza', 'Flores', 'Torres', 'Rivera', 'Rodriguez', 'Morales', 'Lopez',
            'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Castillo', 'Del Rosario'
        ];

        $existingEmails = User::pluck('email')->toArray();
        $facultyCount = 0;

        foreach ($specializations as $index => $specialization) {
            $firstName = $firstNames[$index];
            $lastName = $lastNames[$index];
            $fullName = $firstName . ' ' . $lastName;
            $email = strtolower($firstName . '.' . $lastName . '@uc.edu.ph');

            // Skip if email already exists
            if (in_array($email, $existingEmails)) {
                continue;
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'password' => Hash::make('password123'),
                    'role' => 'faculty',
                    'is_active' => true,
                    'contact_number' => '09' . rand(10000000, 99999999),
                    'address' => 'Cabuyao, Laguna',
                    'gender' => rand(0, 1) ? 'Male' : 'Female',
                ]
            );

            Faculty::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'employee_id' => 'FAC-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'specialization' => $specialization,
                ]
            );

            $facultyCount++;
        }

        $this->command->info('Faculty seeded successfully!');
        $this->command->info('Total faculty created: ' . $facultyCount);
    }
}
