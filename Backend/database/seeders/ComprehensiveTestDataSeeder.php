<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Subject;
use App\Models\Section;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\Material;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Violation;
use App\Models\Achievement;
use App\Models\Announcement;
use App\Models\Notification;
use App\Models\CourseSubject;
use App\Models\Skill;
use App\Models\StudentSkill;
use Illuminate\Support\Facades\Hash;

class ComprehensiveTestDataSeeder extends Seeder
{
    public function run()
    {
        echo "Seeding comprehensive test data...\n";
        
        $this->createTestUsers();
        $this->createAdditionalSubjects();
        $this->createAdditionalSections();
        $this->createAdditionalRooms();
        $this->createSchedules();
        $this->createMaterials();
        $this->createGrades();
        $this->createAttendance();
        $this->createEvents();
        $this->createOrganizations();
        $this->createViolations();
        $this->createAchievements();
        $this->createAnnouncements();
        $this->createNotifications();
        $this->createSkills();
        
        echo "Test data seeding completed!\n";
    }

    private function createTestUsers()
    {
        echo "Creating test users...\n";
        
        $students = [
            ['first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria.s@test.com', 'student_id' => '2024-10001', 'gender' => 'female'],
            ['first_name' => 'Juan', 'last_name' => 'Cruz', 'email' => 'juan.c@test.com', 'student_id' => '2024-10002', 'gender' => 'male'],
            ['first_name' => 'Ana', 'last_name' => 'Reyes', 'email' => 'ana.r@test.com', 'student_id' => '2024-10003', 'gender' => 'female'],
            ['first_name' => 'Carlos', 'last_name' => 'Mendoza', 'email' => 'carlos.m@test.com', 'student_id' => '2024-10004', 'gender' => 'male'],
            ['first_name' => 'Sofia', 'last_name' => 'Garcia', 'email' => 'sofia.g@test.com', 'student_id' => '2024-10005', 'gender' => 'female'],
        ];
        
        foreach ($students as $data) {
            $existingUser = User::where('email', $data['email'])->first();
            if ($existingUser) {
                echo "  - User {$data['email']} already exists, skipping\n";
                continue;
            }
            
            $fullName = $data['first_name'] . ' ' . $data['last_name'];
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'name' => $fullName,
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'student',
                'is_active' => true,
                'contact_number' => '09123456789',
                'address' => 'Test Address',
                'gender' => $data['gender'],
                'birthday' => '2002-01-15',
            ]);
            
            Student::create([
                'user_id' => $user->id,
                'student_id' => $data['student_id'],
                'course_id' => 1,
                'section_id' => 2,
                'year_level' => 1,
                'semester' => '1st',
                'status' => 'regular',
                'mother_name' => 'Test Mother',
                'father_name' => 'Test Father',
            ]);
        }
        
        $facultyData = [
            ['first_name' => 'Ana', 'last_name' => 'Lopez', 'email' => 'ana.lopez@test.com', 'employee_id' => 'FAC-2024-003', 'department' => 'CCS', 'position' => 'Professor'],
            ['first_name' => 'Roberto', 'last_name' => 'Tan', 'email' => 'roberto.t@test.com', 'employee_id' => 'FAC-2024-004', 'department' => 'CCS', 'position' => 'Associate Professor'],
            ['first_name' => 'Clara', 'last_name' => 'Reyes', 'email' => 'clara.r@test.com', 'employee_id' => 'FAC-2024-005', 'department' => 'CCS', 'position' => 'Instructor'],
        ];
        
        foreach ($facultyData as $data) {
            $existingUser = User::where('email', $data['email'])->first();
            if ($existingUser) {
                echo "  - User {$data['email']} already exists, skipping\n";
                continue;
            }
            
            $fullName = $data['first_name'] . ' ' . $data['last_name'];
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'name' => $fullName,
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'faculty',
                'is_active' => true,
                'contact_number' => '09123456789',
            ]);
            
            Faculty::create([
                'user_id' => $user->id,
                'employee_id' => $data['employee_id'],
                'department' => $data['department'],
                'position' => $data['position'],
                'employment_status' => 'Full-time',
                'is_active' => true,
            ]);
        }
    }

    private function createAdditionalSubjects()
    {
        echo "Creating additional subjects...\n";

        $subjects = [
            ['code' => 'CC 3', 'name' => 'Data Structures', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'CC 4', 'name' => 'Database Systems', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'Math 101', 'name' => 'Calculus I', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'Engl 101', 'name' => 'Technical Writing', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'GE 2', 'name' => 'Ethics', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'NSTP 2', 'name' => 'NSTP 2', 'units' => 3, 'year' => 1, 'sem' => 2],
            ['code' => 'PATHFit 2', 'name' => 'Movement & Fitness 2', 'units' => 2, 'year' => 1, 'sem' => 2],
        ];

        foreach ($subjects as $s) {
            $existingSubject = Subject::where('code', $s['code'])->first();
            if ($existingSubject) {
                echo "  - Subject {$s['code']} already exists, skipping\n";
                continue;
            }

            $subject = Subject::create([
                'code' => $s['code'],
                'name' => $s['name'],
                'description' => $s['name'] . ' course description',
                'units' => $s['units'],
                'course_id' => 1,
                'year_level' => $s['year'],
                'semester' => $s['sem'],
                'is_active' => true,
            ]);

            CourseSubject::create([
                'course_id' => 1,
                'subject_id' => $subject->id,
                'year_level' => $s['year'],
                'semester' => $s['sem'],
                'is_active' => true,
            ]);
        }

        // Year 2, Semester 1 subjects
        $year2Subjects = [
            ['code' => 'CC 5', 'name' => 'Web Development', 'units' => 3, 'sem' => 1],
            ['code' => 'CC 6', 'name' => 'Software Engineering', 'units' => 3, 'sem' => 1],
            ['code' => 'Math 200', 'name' => 'Discrete Mathematics', 'units' => 3, 'sem' => 1],
            ['code' => 'GE 3', 'name' => 'Philippine History', 'units' => 3, 'sem' => 1],
        ];

        foreach ($year2Subjects as $subject) {
            $existingSubject = Subject::where('code', $subject['code'])->first();
            if ($existingSubject) {
                echo "  - Subject {$subject['code']} already exists, skipping\n";
                continue;
            }

            $sub = Subject::create([
                'code' => $subject['code'],
                'name' => $subject['name'],
                'description' => $subject['name'] . ' course description',
                'units' => $subject['units'],
                'course_id' => 1,
                'year_level' => 2,
                'semester' => $subject['sem'],
                'is_active' => true,
            ]);

            CourseSubject::create([
                'course_id' => 1,
                'subject_id' => $sub->id,
                'year_level' => 2,
                'semester' => $subject['sem'],
                'is_active' => true,
            ]);
        }
    }

    private function createAdditionalSections()
    {
        echo "Creating additional sections...\n";
        
        $sections = [
            ['name' => '1B', 'course_id' => 1, 'year_level' => 1, 'semester' => '1st'],
            ['name' => '2A', 'course_id' => 1, 'year_level' => 2, 'semester' => '1st'],
        ];
        
        foreach ($sections as $data) {
            $existing = Section::where('name', $data['name'])->where('course_id', $data['course_id'])->first();
            if ($existing) {
                echo "  - Section {$data['name']} already exists, skipping\n";
                continue;
            }
            Section::create($data);
        }
    }

    private function createAdditionalRooms()
    {
        echo "Creating additional rooms...\n";
        
        $rooms = [
            ['name' => 'COM LAB3', 'code' => 'CL3', 'type' => 'laboratory', 'capacity' => 40, 'location' => 'CCS Building'],
            ['name' => 'COM LAB4', 'code' => 'CL4', 'type' => 'laboratory', 'capacity' => 40, 'location' => 'CCS Building'],
            ['name' => 'LECTURE ROOM3', 'code' => 'LR3', 'type' => 'classroom', 'capacity' => 60, 'location' => 'Main Building'],
        ];
        
        foreach ($rooms as $data) {
            $existing = Room::where('code', $data['code'])->first();
            if ($existing) {
                echo "  - Room {$data['code']} already exists, skipping\n";
                continue;
            }
            Room::create($data);
        }
    }

    private function createSchedules()
    {
        echo "Creating schedules...\n";
        
        $faculty = Faculty::with('user')->get();
        $section = Section::where('name', '1A')->first();
        $rooms = Room::all();
        
        $scheduleData = [
            ['subject_id' => 2, 'day' => 'tuesday', 'start' => '08:00', 'end' => '10:00', 'faculty_idx' => 0, 'room_idx' => 1],
            ['subject_id' => 3, 'day' => 'wednesday', 'start' => '10:00', 'end' => '12:00', 'faculty_idx' => 1, 'room_idx' => 2],
            ['subject_id' => 4, 'day' => 'thursday', 'start' => '14:00', 'end' => '16:00', 'faculty_idx' => 2, 'room_idx' => 0],
            ['subject_id' => 5, 'day' => 'friday', 'start' => '09:00', 'end' => '11:00', 'faculty_idx' => 0, 'room_idx' => 1],
        ];
        
        foreach ($scheduleData as $data) {
            Schedule::create([
                'subject_id' => $data['subject_id'],
                'faculty_id' => $faculty[$data['faculty_idx']]->id,
                'section_id' => $section->id,
                'room_id' => $rooms[$data['room_idx']]->id,
                'day' => $data['day'],
                'start_time' => $data['start'],
                'end_time' => $data['end'],
                'academic_year' => '2024-2025',
                'semester' => 1,
            ]);
        }
    }

    private function createMaterials()
    {
        echo "Creating materials...\n";
        
        $subjects = Subject::limit(3)->get();
        $faculty = Faculty::first();
        
        foreach ($subjects as $subject) {
            Material::create([
                'subject_id' => $subject->id,
                'uploaded_by' => $faculty->user_id,
                'title' => 'Lecture Notes - ' . $subject->name,
                'description' => 'Course materials for ' . $subject->name,
                'file_path' => 'materials/sample.pdf',
                'type' => 'pdf',
            ]);
        }
    }

    private function createGrades()
    {
        echo "Creating grades...\n";
        
        $students = Student::limit(5)->get();
        $subjects = Subject::limit(3)->get();
        $faculty = Faculty::first();
        
        foreach ($students as $student) {
            foreach ($subjects as $subject) {
                Grade::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'faculty_id' => $faculty->id,
                    'academic_year' => '2024-2025',
                    'semester' => 1,
                    'midterm_grade' => rand(80, 95),
                    'final_grade' => rand(80, 95),
                    'total_grade' => rand(80, 95),
                    'remarks' => 'Passed',
                ]);
            }
        }
    }

    private function createAttendance()
    {
        echo "Creating attendance...\n";
        
        $schedules = Schedule::limit(2)->get();
        $students = Student::limit(5)->get();
        $faculty = Faculty::first();
        
        foreach ($schedules as $schedule) {
            foreach ($students as $student) {
                Attendance::create([
                    'schedule_id' => $schedule->id,
                    'student_id' => $student->id,
                    'date' => now()->subDays(rand(1, 30)),
                    'status' => rand(0, 1) ? 'present' : 'absent',
                    'marked_by' => $faculty->user_id,
                ]);
            }
        }
    }

    private function createEvents()
    {
        echo "Creating events...\n";
        
        Event::create([
            'title' => 'Tech Symposium 2024',
            'description' => 'Annual technology symposium featuring industry speakers',
            'type' => 'academic',
            'start_date' => now()->addDays(15),
            'end_date' => now()->addDays(15)->addHours(4),
            'venue' => 'Main Auditorium',
            'organized_by' => 1,
            'status' => 'approved',
        ]);
        
        Event::create([
            'title' => 'Career Fair',
            'description' => 'Job fair with top tech companies',
            'type' => 'extra_curricular',
            'start_date' => now()->addDays(30),
            'end_date' => now()->addDays(30)->addHours(6),
            'venue' => 'University Gym',
            'organized_by' => 1,
            'status' => 'approved',
        ]);
    }

    private function createOrganizations()
    {
        echo "Creating organizations...\n";
        
        $org = Organization::create([
            'name' => 'Computer Society',
            'description' => 'Organization for computer science students',
            'adviser_id' => 1,
            'category' => 'Academic',
            'is_active' => true,
        ]);
        
        $students = Student::limit(3)->get();
        foreach ($students as $student) {
            OrganizationMember::create([
                'organization_id' => $org->id,
                'student_id' => $student->id,
                'role' => 'member',
                'joined_at' => now(),
            ]);
        }
    }

    private function createViolations()
    {
        echo "Creating violations...\n";
        
        $student = Student::first();
        
        Violation::create([
            'student_id' => $student->id,
            'reported_by' => 1,
            'type' => 'Attendance',
            'severity' => 'minor',
            'description' => 'Late attendance',
            'violation_date' => now()->subDays(5),
            'status' => 'approved',
        ]);
    }

    private function createAchievements()
    {
        echo "Creating achievements...\n";
        
        $student = Student::first();
        
        Achievement::create([
            'student_id' => $student->id,
            'recorded_by' => 1,
            'title' => 'Dean\'s Lister',
            'type' => 'academic',
            'description' => 'Achieved Dean\'s List for Semester 1',
            'achievement_date' => now()->subMonths(2),
            'status' => 'approved',
        ]);
    }

    private function createAnnouncements()
    {
        echo "Creating announcements...\n";
        
        Announcement::create([
            'title' => 'Enrollment Schedule',
            'content' => 'Enrollment for Semester 2 starts on May 1, 2024',
            'author_id' => 1,
            'target_audience' => 'all',
            'priority' => 'high',
            'is_published' => true,
        ]);
        
        Announcement::create([
            'title' => 'Holiday Notice',
            'content' => 'University will be closed on May 1 for Labor Day',
            'author_id' => 1,
            'target_audience' => 'all',
            'priority' => 'medium',
            'is_published' => true,
        ]);
    }

    private function createNotifications()
    {
        echo "Creating notifications...\n";
        
        $users = User::limit(5)->get();
        
        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Welcome to Campus Learn Hub',
                'message' => 'Your account has been successfully created',
                'type' => 'info',
                'is_read' => false,
            ]);
        }
    }

    private function createSkills()
    {
        echo "Creating skills...\n";
        
        $skills = [
            ['name' => 'Programming', 'description' => 'Software development skills'],
            ['name' => 'Web Development', 'description' => 'Frontend and backend web technologies'],
            ['name' => 'Database Management', 'description' => 'SQL and NoSQL databases'],
            ['name' => 'Communication', 'description' => 'Verbal and written communication'],
            ['name' => 'Leadership', 'description' => 'Team leadership and management'],
        ];
        
        foreach ($skills as $skill) {
            Skill::create($skill);
        }
        
        $students = Student::limit(3)->get();
        $skillIds = Skill::pluck('id');
        $levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        
        foreach ($students as $student) {
            foreach ($skillIds->take(3) as $skillId) {
                StudentSkill::create([
                    'student_id' => $student->id,
                    'skill_id' => $skillId,
                    'level' => $levels[array_rand($levels)],
                ]);
            }
        }
    }
}
