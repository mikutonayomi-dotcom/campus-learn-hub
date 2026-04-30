<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Section;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Get BSIT course
        $course = Course::where('code', 'BSIT')->first();
        
        if (!$course) {
            $this->command->warn('BSIT course not found. Please run CourseSubjectsSeeder first.');
            return;
        }

        // Get all 1st semester sections
        $sections = Section::where('semester', '1st')
            ->where('course_id', $course->id)
            ->orderBy('year_level')
            ->orderBy('name')
            ->get();

        if ($sections->isEmpty()) {
            $this->command->warn('No 1st semester sections found. Please run SectionsSeeder first.');
            return;
        }

        $firstNames = [
            'Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Rosa', 'Miguel', 'Carmen',
            'Carlos', 'Elena', 'Antonio', 'Sofia', 'Francisco', 'Laura', 'Luis',
            'Isabella', 'Diego', 'Valentina', 'Javier', 'Camila', 'Andres', 'Lucia',
            'Rafael', 'Martina', 'Gabriel', 'Daniela', 'Alejandro', 'Valeria', 'Mateo',
            'Renata', 'Sebastian', 'Victoria', 'Nicolas', 'Emilia', 'Leonardo', 'Sofia',
            'Bruno', 'Clara', 'Thiago', 'Julia', 'Enzo', 'Manuela', 'Lorenzo', 'Beatriz'
        ];

        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Fernandez', 'Ramos',
            'Mendoza', 'Flores', 'Torres', 'Rivera', 'Rodriguez', 'Morales', 'Lopez',
            'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Castillo', 'Del Rosario',
            'Aquino', 'Villanueva', 'Santiago', 'Magsaysay', 'Rizal', 'Bonifacio',
            'Aquinaldo', 'Del Pilar', 'Jacinto', 'Luna', 'Malvar', 'Osmena', 'Roxas',
            'Quirino', 'Magsaysay', 'Garcia', 'Macapagal', 'Marcos', 'Aquino', 'Ramos',
            'Estrada', 'Arroyo', 'Aquino', 'Benigno', 'Duterte', 'Marcos Jr'
        ];

        $existingEmails = User::pluck('email')->toArray();
        $studentCount = 0;
        $totalStudentsNeeded = 980;

        // Group sections by year level
        $sectionsByYear = [];
        foreach ($sections as $section) {
            if (!isset($sectionsByYear[$section->year_level])) {
                $sectionsByYear[$section->year_level] = [];
            }
            $sectionsByYear[$section->year_level][] = $section;
        }

        // Calculate students per year level (evenly distribute)
        $years = [1, 2, 3, 4];
        $studentsPerYear = floor($totalStudentsNeeded / count($years));
        $remainder = $totalStudentsNeeded % count($years);

        $studentsPerYearLevel = [];
        foreach ($years as $index => $year) {
            $studentsPerYearLevel[$year] = $studentsPerYear + ($index < $remainder ? 1 : 0);
        }

        $studentIndex = 0;

        // Distribute students evenly across year levels
        foreach ($years as $year) {
            $studentsNeededForYear = $studentsPerYearLevel[$year];
            $yearSections = $sectionsByYear[$year] ?? [];
            
            if (empty($yearSections)) {
                $this->command->warn("No sections found for year $year");
                continue;
            }

            // Calculate students per section for this year
            $sectionCount = count($yearSections);
            $studentsPerSection = floor($studentsNeededForYear / $sectionCount);
            $remainder = $studentsNeededForYear % $sectionCount;

            $sectionIndex = 0;
            $studentsCreatedForYear = 0;

            while ($studentsCreatedForYear < $studentsNeededForYear && $studentIndex < $totalStudentsNeeded) {
                $section = $yearSections[$sectionIndex % $sectionCount];
                
                // Calculate how many students for this specific section
                $sectionQuota = $studentsPerSection + ($sectionIndex < $remainder ? 1 : 0);
                $currentStudentsInSection = Student::where('section_id', $section->id)->count();
                $studentsToAdd = min($sectionQuota, $section->capacity - $currentStudentsInSection);

                if ($studentsToAdd <= 0) {
                    $sectionIndex++;
                    continue;
                }

                // Generate student data
                $firstName = $firstNames[array_rand($firstNames)];
                $lastName = $lastNames[array_rand($lastNames)];
                $middleInitial = chr(rand(65, 90)) . '.';
                $fullName = $firstName . ' ' . $middleInitial . ' ' . $lastName;
                $studentIdNumber = date('Y') . '-' . str_pad($studentIndex + 1, 5, '0', STR_PAD_LEFT);
                $email = strtolower($firstName . '.' . $lastName . ($studentIndex + 1) . '@uc.edu.ph');

                // Skip if email already exists
                if (in_array($email, $existingEmails)) {
                    $studentIndex++;
                    continue;
                }

                // Create user
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'first_name' => $firstName,
                        'middle_name' => $middleInitial,
                        'last_name' => $lastName,
                        'name' => $fullName,
                        'password' => Hash::make('password123'),
                        'role' => 'student',
                        'is_active' => true,
                        'contact_number' => '09' . rand(10000000, 99999999),
                        'address' => 'Cabuyao, Laguna',
                        'gender' => rand(0, 1) ? 'Male' : 'Female',
                        'birthday' => $this->generateRandomBirthday($year),
                    ]
                );

                // Create student profile
                Student::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'student_id' => $studentIdNumber,
                        'course_id' => $course->id,
                        'section_id' => $section->id,
                        'year_level' => $year,
                        'semester' => '1st',
                        'contact_number' => $user->contact_number,
                        'address' => $user->address,
                        'emergency_contact_name' => $lastName . ' Family',
                        'emergency_contact_number' => '09' . rand(10000000, 99999999),
                        'status' => 'regular',
                        'gender' => $user->gender,
                        'birthday' => $user->birthday,
                    ]
                );

                $studentCount++;
                $studentsCreatedForYear++;
                $studentIndex++;
                $existingEmails[] = $email;

                // Move to next section after filling current quota
                if ($studentIndex % $sectionQuota == 0) {
                    $sectionIndex++;
                }
            }
        }

        $this->command->info('Students seeded successfully!');
        $this->command->info('Total students created: ' . $studentCount);

        // Show distribution
        $this->command->info("\nStudent Distribution:");
        foreach ($sections as $section) {
            $count = Student::where('section_id', $section->id)->count();
            $this->command->info($section->name . ' - Year ' . $section->year_level . ': ' . $count . ' students');
        }
    }

    private function generateRandomBirthday($yearLevel)
    {
        // Calculate approximate birth year based on year level
        // Assuming 1st year students are ~17-18 years old
        $currentYear = date('Y');
        $birthYear = $currentYear - (17 + $yearLevel - 1);
        $birthMonth = rand(1, 12);
        $birthDay = rand(1, 28);
        return sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay);
    }
}
