<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Section;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class IncrementalStudentSeeder extends Seeder
{
    public function run(): void
    {
        // Get BSIT course
        $course = Course::where('code', 'BSIT')->first();
        
        if (!$course) {
            $this->command->warn('BSIT course not found. Please run CourseSubjectsSeeder first.');
            return;
        }

        // Get current student count
        $currentStudentCount = Student::count();
        $targetStudentCount = 980;
        $studentsNeeded = $targetStudentCount - $currentStudentCount;

        if ($studentsNeeded <= 0) {
            $this->command->info("Target already reached. Current students: $currentStudentCount");
            return;
        }

        $this->command->info("Current students: $currentStudentCount");
        $this->command->info("Students needed: $studentsNeeded");

        // Get last student ID to continue sequence
        $lastStudent = Student::orderBy('id', 'desc')->first();
        $lastStudentId = $lastStudent ? $lastStudent->student_id : null;
        $lastIdNumber = $lastStudentId ? (int)substr($lastStudentId, -5) : 0;

        $this->command->info("Last student ID: $lastStudentId");
        $this->command->info("Continuing from ID: " . ($lastIdNumber + 1));

        // Get all 1st semester sections with available capacity
        $sections = Section::where('semester', '1st')
            ->where('course_id', $course->id)
            ->orderBy('year_level')
            ->orderBy('name')
            ->get();

        if ($sections->isEmpty()) {
            $this->command->warn('No 1st semester sections found.');
            return;
        }

        // Calculate available capacity per section
        $availableSections = [];
        $totalAvailableCapacity = 0;

        foreach ($sections as $section) {
            $currentCount = Student::where('section_id', $section->id)->count();
            $available = $section->capacity - $currentCount;
            
            if ($available > 0) {
                $availableSections[] = [
                    'section' => $section,
                    'available' => $available,
                    'year_level' => $section->year_level
                ];
                $totalAvailableCapacity += $available;
            }
        }

        if (empty($availableSections)) {
            $this->command->warn('No sections with available capacity found.');
            return;
        }

        $this->command->info("Total available capacity: $totalAvailableCapacity");

        if ($totalAvailableCapacity < $studentsNeeded) {
            $this->command->warn("Not enough capacity. Available: $totalAvailableCapacity, Needed: $studentsNeeded");
            $this->command->warn("Will only create $totalAvailableCapacity students.");
            $studentsNeeded = $totalAvailableCapacity;
        }

        // Prepare data for batch insert
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
        $existingStudentIds = Student::pluck('student_id')->toArray();

        $usersToInsert = [];
        $studentsToInsert = [];
        $studentIndex = $lastIdNumber;
        $studentsCreated = 0;

        // Distribute students across available sections
        foreach ($availableSections as $sectionData) {
            $section = $sectionData['section'];
            $available = $sectionData['available'];
            $yearLevel = $sectionData['year_level'];

            $studentsForThisSection = min($available, $studentsNeeded - $studentsCreated);

            for ($i = 0; $i < $studentsForThisSection; $i++) {
                $studentIndex++;
                $firstName = $firstNames[array_rand($firstNames)];
                $lastName = $lastNames[array_rand($lastNames)];
                $middleInitial = chr(rand(65, 90)) . '.';
                $fullName = $firstName . ' ' . $middleInitial . ' ' . $lastName;
                $studentIdNumber = date('Y') . '-' . str_pad($studentIndex, 5, '0', STR_PAD_LEFT);
                $email = strtolower($firstName . '.' . $lastName . $studentIndex . '@uc.edu.ph');

                // Skip if email or student ID already exists
                if (in_array($email, $existingEmails) || in_array($studentIdNumber, $existingStudentIds)) {
                    continue;
                }

                $usersToInsert[] = [
                    'first_name' => $firstName,
                    'middle_name' => $middleInitial,
                    'last_name' => $lastName,
                    'name' => $fullName,
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'is_active' => true,
                    'contact_number' => '09' . rand(10000000, 99999999),
                    'address' => 'Cabuyao, Laguna',
                    'gender' => rand(0, 1) ? 'Male' : 'Female',
                    'birthday' => $this->generateRandomBirthday($yearLevel),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $studentsToInsert[] = [
                    'student_id' => $studentIdNumber,
                    'course_id' => $course->id,
                    'section_id' => $section->id,
                    'year_level' => $yearLevel,
                    'semester' => '1st',
                    'contact_number' => '09' . rand(10000000, 99999999),
                    'address' => 'Cabuyao, Laguna',
                    'emergency_contact_name' => $lastName . ' Family',
                    'emergency_contact_number' => '09' . rand(10000000, 99999999),
                    'status' => 'regular',
                    'gender' => rand(0, 1) ? 'male' : 'female',
                    'birthday' => $this->generateRandomBirthday($yearLevel),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $existingEmails[] = $email;
                $existingStudentIds[] = $studentIdNumber;
                $studentsCreated++;
            }

            if ($studentsCreated >= $studentsNeeded) {
                break;
            }
        }

        // Batch insert users
        if (!empty($usersToInsert)) {
            DB::table('users')->insert($usersToInsert);
            $this->command->info('Inserted ' . count($usersToInsert) . ' users.');
        }

        // Get the inserted user IDs and link them to students
        if (!empty($studentsToInsert)) {
            $insertedUsers = User::where('role', 'student')
                ->where('created_at', '>=', now()->subMinutes(5))
                ->orderBy('id', 'asc')
                ->get();

            foreach ($studentsToInsert as $index => $studentData) {
                if (isset($insertedUsers[$index])) {
                    $studentData['user_id'] = $insertedUsers[$index]->id;
                    DB::table('students')->insert($studentData);
                }
            }
            $this->command->info('Inserted ' . count($studentsToInsert) . ' student profiles.');
        }

        $this->command->info('Incremental student seeding completed!');
        $this->command->info("Total students created: $studentsCreated");
        $this->command->info("New total students: " . Student::count());

        // Show distribution
        $this->command->info("\nUpdated Student Distribution:");
        foreach ($sections as $section) {
            $count = Student::where('section_id', $section->id)->count();
            $this->command->info($section->name . ' - Year ' . $section->year_level . ': ' . $count . '/' . $section->capacity . ' students');
        }
    }

    private function generateRandomBirthday($yearLevel)
    {
        $currentYear = date('Y');
        $birthYear = $currentYear - (17 + $yearLevel - 1);
        $birthMonth = rand(1, 12);
        $birthDay = rand(1, 28);
        return sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay);
    }
}
