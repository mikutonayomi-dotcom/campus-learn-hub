<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['user', 'course', 'section', 'skills', 'organizations', 'violations', 'achievements']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Advanced filters
        if ($request->has('skill_id')) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->where('skill_id', $request->skill_id);
            });
        }

        if ($request->has('skill_ids')) {
            $skillIds = explode(',', $request->skill_ids);
            $query->whereHas('skills', function ($q) use ($skillIds) {
                $q->whereIn('skill_id', $skillIds);
            });
        }

        if ($request->has('has_violations')) {
            if ($request->has_violations === 'true') {
                $query->whereHas('violations');
            } else {
                $query->whereDoesntHave('violations');
            }
        }

        if ($request->has('violation_severity')) {
            $query->whereHas('violations', function ($q) use ($request) {
                $q->where('severity', $request->violation_severity);
            });
        }

        if ($request->has('has_achievements')) {
            if ($request->has_achievements === 'true') {
                $query->whereHas('achievements');
            } else {
                $query->whereDoesntHave('achievements');
            }
        }

        if ($request->has('organization_id')) {
            $query->whereHas('organizations', function ($q) use ($request) {
                $q->where('organization_id', $request->organization_id);
            });
        }

        if ($request->has('organization_ids')) {
            $orgIds = explode(',', $request->organization_ids);
            $query->whereHas('organizations', function ($q) use ($orgIds) {
                $q->whereIn('organization_id', $orgIds);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('student_id', 'like', "%{$search}%");
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string',
            'middlename' => 'nullable|string',
            'lastname' => 'required|string',
            'suffix' => 'nullable|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'student_id' => 'required|string|unique:students',
            'course_id' => 'required|exists:courses,id',
            'section_id' => 'nullable|exists:sections,id',
            'year_level' => 'required|integer|min:1|max:5',
            'semester' => 'nullable|in:1st,2nd',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_number' => 'nullable|string',
            'mother_name' => 'nullable|string',
            'father_name' => 'nullable|string',
            'guardian_name' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
            'birthplace' => 'nullable|string',
            'religion' => 'nullable|string',
        ]);

        // Build full name from parts
        $fullName = $validated['firstname'];
        if (!empty($validated['middlename'])) {
            $fullName .= ' ' . $validated['middlename'];
        }
        $fullName .= ' ' . $validated['lastname'];
        if (!empty($validated['suffix'])) {
            $fullName .= ' ' . $validated['suffix'];
        }

        $user = User::create([
            'first_name' => $validated['firstname'],
            'middle_name' => $validated['middlename'] ?? null,
            'last_name' => $validated['lastname'],
            'suffix' => $validated['suffix'] ?? null,
            'name' => $fullName,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'birthday' => $validated['birthday'] ?? null,
            'birthplace' => $validated['birthplace'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'father_name' => $validated['father_name'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'section_id' => $validated['section_id'] ?? null,
            'year_level' => $validated['year_level'],
            'semester' => $validated['semester'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_number' => $validated['emergency_contact_number'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'father_name' => $validated['father_name'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'birthday' => $validated['birthday'] ?? null,
            'birthplace' => $validated['birthplace'] ?? null,
            'religion' => $validated['religion'] ?? null,
        ]);

        return response()->json($student->load('user', 'course', 'section'), 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load([
            'user', 'course', 'section', 'skills', 'organizations',
            'violations', 'achievements', 'grades.subject', 'attendance'
        ]));
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'section_id' => 'sometimes|nullable|exists:sections,id',
            'year_level' => 'sometimes|integer|min:1|max:5',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_number' => 'nullable|string',
            'status' => 'sometimes|in:regular,irregular,probation,suspended,graduated',
        ]);

        $student->update($validated);

        if ($request->has('name') || $request->has('email') || $request->has('profile_image')) {
            $student->user->update($request->only(['name', 'email', 'profile_image']));
        }

        return response()->json($student->load('user', 'course', 'section'));
    }

    public function updateProfileImage(Request $request)
    {
        try {
            $request->validate([
                'profile_image' => 'required|image|max:2048', // Max 2MB
            ]);

            $user = $request->user();

            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $path = $file->store('profile-images', 'public');
                $user->update(['profile_image' => $path]);
            }

            return response()->json(['profile_image' => $user->profile_image]);
        } catch (\Exception $e) {
            \Log::error('Student updateProfileImage error: ' . $e->getMessage());
            \Log::error('Student updateProfileImage trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to upload profile image'], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $student = $request->user()->student;
            
            $validated = $request->validate([
                'contact_number' => 'nullable|string',
                'address' => 'nullable|string',
                'emergency_contact_name' => 'nullable|string',
                'emergency_contact_number' => 'nullable|string',
            ]);

            $student->update($validated);

            return response()->json($student->load('user'));
        } catch (\Exception $e) {
            \Log::error('Student updateProfile error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    public function destroy(Student $student)
    {
        $student->user->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }

    public function myProfile(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'message' => 'Student profile not found. Please contact administrator to set up your student profile.'
                ], 404);
            }

            return response()->json($student->load([
                'user', 'course', 'section', 'skills', 'organizations',
                'violations', 'achievements', 'grades.subject'
            ]));
        } catch (\Exception $e) {
            \Log::error('myProfile error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch profile'], 500);
        }
    }

    public function mySubjects(Request $request)
    {
        try {
            $user = $request->user();
            \Log::info('mySubjects - User ID: ' . $user->id . ', Role: ' . $user->role);

            $student = $user->student;

            if (!$student) {
                \Log::info('mySubjects - No student profile found for user: ' . $user->id);
                return response()->json([]);
            }

            if (!is_object($student)) {
                \Log::error('mySubjects - Student is not an object: ' . gettype($student));
                return response()->json([]);
            }

            // Get subjects through curriculum (course_subjects) based on student's course, year level, and semester
            $subjects = $student->curriculumSubjects();

            return response()->json($subjects);
        } catch (\Exception $e) {
            \Log::error('mySubjects error: ' . $e->getMessage());
            \Log::error('mySubjects trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch subjects'], 500);
        }
    }

    public function getNextStudentId()
    {
        $currentYear = date('Y');
        $count = Student::whereYear('created_at', $currentYear)->count();
        $nextNumber = str_pad($count + 1, 2, '0', STR_PAD_LEFT);
        $nextId = $currentYear . '-' . $nextNumber;
        
        return response()->json(['next_id' => $nextId]);
    }
}
