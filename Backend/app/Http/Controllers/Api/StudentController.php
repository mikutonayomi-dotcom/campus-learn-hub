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
        $query = Student::with(['user', 'course', 'section', 'skills', 'organizations']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
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
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_number' => 'nullable|string',
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
            'name' => $fullName,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'section_id' => $validated['section_id'] ?? null,
            'section' => $validated['section_id'] ? null : 'TBA',
            'year_level' => $validated['year_level'],
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_number' => $validated['emergency_contact_number'] ?? null,
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

        if ($request->has('name') || $request->has('email')) {
            $student->user->update($request->only(['name', 'email']));
        }

        return response()->json($student->load('user', 'course', 'section'));
    }

    public function destroy(Student $student)
    {
        $student->user->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }

    public function myProfile(Request $request)
    {
        $student = $request->user()->student;
        
        if (!$student) {
            return response()->json([
                'message' => 'Student profile not found. Please contact administrator to set up your student profile.'
            ], 404);
        }
        
        return response()->json($student->load([
            'user', 'course', 'skills', 'organizations',
            'violations', 'achievements', 'grades.subject'
        ]));
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
