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
        $query = Student::with(['user', 'course', 'skills', 'organizations']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('section')) {
            $query->where('section', $request->section);
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
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'student_id' => 'required|string|unique:students',
            'course_id' => 'required|exists:courses,id',
            'section' => 'required|string',
            'year_level' => 'required|integer|min:1|max:5',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_number' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'section' => $validated['section'],
            'year_level' => $validated['year_level'],
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_number' => $validated['emergency_contact_number'] ?? null,
        ]);

        return response()->json($student->load('user', 'course'), 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load([
            'user', 'course', 'skills', 'organizations',
            'violations', 'achievements', 'grades.subject', 'attendance'
        ]));
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'section' => 'sometimes|string',
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

        return response()->json($student->load('user', 'course'));
    }

    public function destroy(Student $student)
    {
        $student->user->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }

    public function myProfile(Request $request)
    {
        $student = $request->user()->student;
        return response()->json($student->load([
            'user', 'course', 'skills', 'organizations',
            'violations', 'achievements', 'grades.subject'
        ]));
    }
}
